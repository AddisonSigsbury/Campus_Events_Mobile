import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { StackActions, NavigationActions } from 'react-navigation'
import { supabase } from '../lib/supabase/supabase';
import { useAuthContext } from '../lib/supabase/hooks/useAuthContext';

const LoginScreen = ({ navigation }) => {
	const { isLoading: authLoading } = useAuthContext(); // optional: read global loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

  const handleSignIn = async () => {
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message ?? 'Failed to sign in.');
        console.error('Sign-in error', error);
      } else {
        // Signed in — session will be available via AuthProvider's onAuthStateChange.
        // navigates the user to directory screen upon login:
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Directory_Screen'})],
		});
		navigation.dispatch(resetAction);
      }
    } catch (err) {
      console.error('Unexpected sign-in error', err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
				placeholder="Email"
				keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(newValue) => setEmail(newValue)}
      />

      <TextInput
        style={styles.input}
				placeholder="Password"
				secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={(newValue) => setPassword(newValue)}
      />

	  	{errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

			<TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate('Sign_Up_Screen')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Directory_Screen")}>
        <Text style={styles.guest}>Continue as guest</Text>
      </TouchableOpacity>

      <Text>Your email is: {email}</Text>
      <Text>Your password is: {password ? '●'.repeat(password.length) : ''}</Text>
    </View>
  );
};

LoginScreen.navigationOptions = {
  headerShown: true, // Show the header
  title: "Events",
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
  input: {
    margin: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  guest: {
    color: "blue",
		marginTop: 12,
		textAlign: 'center',
  },
	button: {
		marginTop: 12,
    backgroundColor: '#2b8aef',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
	},
	buttonText: {
		color: 'white',
	},
	link: {
		color: 'blue',
		marginTop: 12,
		textAlign: 'center',
	},
	error: {
		textAlign: 'center'
	},
	title: {
		textAlign: 'center',
		fontSize: 24,
	},
});

export default LoginScreen;
