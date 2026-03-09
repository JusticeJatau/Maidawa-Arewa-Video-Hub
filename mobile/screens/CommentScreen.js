import { useContext, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { api } from "../services/api";
import { CommentsScreenSkeleton } from "../components/Skeleton";
import { AuthContext } from "../context/AuthContext";

import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

export default function CommentScreen({ route, navigation }) {
    const { theme } = useTheme();
    const { isLoggedIn } = useContext(AuthContext);

    const { videoId } = route.params || {};
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const fetchComments = async (id) => {
        if (!id) return;
        setLoading(true);

        try {
            const { data } = await api.get(`/comments/${id}`);
            setComments(data ?? []);
        } catch (err) {
            console.warn("Failed to fetch comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoId) fetchComments(videoId);
    }, [videoId]);

    const sendComment = async () => {
        if(!isLoggedIn){
            navigation.replace('Login');
        return;
        }
        const trimmed = text.trim();
        if (!trimmed || !videoId) return;

        setText("");
        setSending(true);

        try {
            const { data } = await api.post(`/comments/${videoId}`, { content: trimmed });

            if (data) {
                setComments((prev) => [data, ...prev]);
            }
        } catch (err) {
            console.warn("Failed to send comment", err);
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const renderItem = ({ item }) => (
        <View style={styles.commentContainer}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {item.userId ? item?.userId.name.charAt(0).toUpperCase() : "A"}
                </Text>
            </View>
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.userName}>{item?.userId?.name || "Anonymous"}</Text>
                    <Text style={styles.timeAgo}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.content}</Text>
                
                <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="thumb-up" size={16} color={theme.textTertiary} />
                        <Text style={styles.actionText}>{item.likes || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="thumb-down" size={16} color={theme.textTertiary} />
                        <Text style={styles.actionText}>{item.dislikes || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="reply" size={16} color={theme.textTertiary} />
                        <Text style={styles.actionText}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="comment" size={64} color={theme.textTertiary} />
            <Text style={styles.emptyTitle}>No comments yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share your thoughts!</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Comments</Text>
            <Text style={styles.commentCount}>{comments.length}</Text>
        </View>
    );

    const styles = StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background 
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: theme.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: theme.background,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
        },
        commentCount: {
            fontSize: 16,
            color: theme.primary,
            fontWeight: '600',
            backgroundColor: theme.surfaceLight,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 16,
        },
        list: { 
            padding: 16, 
            flexGrow: 1,
        },
        loaderContainer: {
            paddingVertical: 40,
            alignItems: 'center',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
            marginTop: 16,
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 14,
            color: theme.textTertiary,
            textAlign: 'center',
        },
        commentContainer: { 
            flexDirection: "row", 
            marginBottom: 20, 
            alignItems: "flex-start" 
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
        },
        avatarText: { 
            color: theme.text, 
            fontWeight: "700",
            fontSize: 16,
        },
        commentContent: {
            flex: 1,
            backgroundColor: theme.surface,
            borderRadius: 16,
            padding: 12,
        },
        commentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
        },
        userName: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.text,
        },
        timeAgo: {
            fontSize: 12,
            color: theme.textTertiary,
        },
        commentText: { 
            color: theme.textSecondary,
            fontSize: 15,
            lineHeight: 20,
            marginBottom: 10,
        },
        commentActions: {
            flexDirection: 'row',
            gap: 16,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        actionText: {
            color: theme.textTertiary,
            fontSize: 12,
        },
        inputRow: {
            flexDirection: "row",
            alignItems: "flex-end",
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            gap: 8,
        },
        input: {
            flex: 1,
            maxHeight: 100,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: theme.background,
            borderRadius: 24,
            color: theme.text,
            fontSize: 15,
            borderWidth: 1,
            borderColor: theme.border,
        },
        sendButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
        },
        sendButtonDisabled: {
            backgroundColor: theme.border,
            opacity: 0.5,
        },
    });

    if(loading){
        return <CommentsScreenSkeleton/>
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            
            

            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            > 
                <View style={{flex: 1,}}>
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id ?? item._id ?? Math.random().toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={!loading && renderEmpty}
                        ListHeaderComponent={loading ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color={theme.primary} />
                            </View>
                        ) : null}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.surface }}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Write a comment..."
                            placeholderTextColor={theme.textTertiary}
                            value={text}
                            onChangeText={(value) => setText(value)}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity 
                            style={[
                                styles.sendButton, 
                                (!text.trim() || sending) && styles.sendButtonDisabled
                            ]} 
                            onPress={sendComment} 
                            disabled={!text.trim() || sending}
                            activeOpacity={0.7}
                        >
                            {sending ? (
                                <ActivityIndicator size="small" color={theme.text} />
                            ) : (
                                <MaterialIcons name="send" size={22} color={theme.text} />
                            )}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}