import React, { useState, useMemo, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import { setToken, setUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

const SignUpScreen = ({ navigation }) => {
  const otpRefs = useRef([]); // NEW: refs for OTP inputs
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  // Form data
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // only allow one digit per box

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value) {
      // Auto-focus next input
      if (index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    } else {
      // If deleting, focus previous input
      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const validateStep1 = () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter complete 6-digit code');
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;

    try {
      setVerificationLoading(true);
      const response = await api.post("/auth/send-otp", { email: form.email, name:form.name });
      
      if (response.data.success) {
        setCurrentStep(2);
        startTimer();
        Alert.alert("Success", "Verification code sent to your email");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to send verification code");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    try {
      setVerificationLoading(true);
      const otpString = otp.join('');
      const response = await api.post("/auth/verify-otp", { 
        email: form.email, 
        otp: otpString 
      });
      
      if (response.data.success) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setOtpError(error.response?.data?.message || "Invalid verification code");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setVerificationLoading(true);
      const response = await api.post("/auth/resend-otp", { email: form.email, name: form.name });
      
      if (response.data.success) {
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        setTimer(60);
        setCanResend(false);
        Alert.alert("Success", "New verification code sent");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Failed to resend code");
    } finally {
      setVerificationLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;

    try {
      setLoading(true);
      const response = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      const { token, user } = response.data;
      await setToken(token);
      await setUser(user)
      await login(token, user)

      Alert.alert("Success", "Account created successfully!");
      navigation.replace("MainTabs");
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
        <Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text>
      </View>
      <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
      <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
        <Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text>
      </View>
      <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
      <View style={[styles.step, currentStep >= 3 && styles.stepActive]}>
        <Text style={[styles.stepText, currentStep >= 3 && styles.stepTextActive]}>3</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Create Account</Text>
      <Text style={styles.stepSubtitle}>Enter your details to get started</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person-outline" size={20} color={theme.textTertiary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={theme.textTertiary}
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color={theme.textTertiary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={theme.textTertiary}
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, verificationLoading && styles.buttonDisabled]}
        onPress={handleSendOtp}
        disabled={verificationLoading}
        activeOpacity={0.7}
      >
        {verificationLoading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentStep(1)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Verify Email</Text>
      <Text style={styles.stepSubtitle}>
        Enter the 6-digit code sent to{'\n'}{form.email}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => otpRefs.current[index] = el} // assign ref
            style={[styles.otpInput, otpError && styles.otpInputError]}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            onKeyPress={({ nativeEvent }) => {
              // handle backspace
              if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                otpRefs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>

      {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code?"}
        </Text>
        <TouchableOpacity 
          onPress={handleResendOtp}
          disabled={!canResend || verificationLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.resendText, (!canResend || verificationLoading) && styles.resendDisabled]}>
            Resend
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, verificationLoading && styles.buttonDisabled]}
        onPress={handleVerifyOtp}
        disabled={verificationLoading}
        activeOpacity={0.7}
      >
        {verificationLoading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentStep(2)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Set Password</Text>
      <Text style={styles.stepSubtitle}>Create a strong password for your account</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color={theme.textTertiary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.textTertiary}
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color={theme.textTertiary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={theme.textTertiary}
          value={form.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <MaterialIcons name="play-circle-filled" size={48} color={theme.primary} />
            <Text style={styles.headerTitle}>MA Video Hub</Text>
          </View>

          {renderStepIndicator()}

          <View style={styles.formContainer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </View>

          {currentStep === 1 && (
            <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.7}>
              <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textTertiary,
  },
  stepTextActive: {
    color: theme.text,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: theme.primary,
  },
  formContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: theme.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
  },
  linkBold: {
    color: theme.primary,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: -50,
    left: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.surface,
    zIndex: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 60,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: theme.text,
  },
  otpInputError: {
    borderColor: theme.danger,
  },
  errorText: {
    color: theme.danger,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  timerText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  resendText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendDisabled: {
    opacity: 0.5,
  },
});

export default SignUpScreen;