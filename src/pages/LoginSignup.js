// src/components/LoginSignup.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../components/firebase';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Importing icons from react-icons
import { getDatabase, ref, set } from 'firebase/database';

// Centering container style
const CenteredContainer = styled.div`
  background-color: #0C2145;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  background-color: #142748;
  border-radius: 20px; /* Increased for softer corners */
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.2); /* Softer shadow for floating effect */
  position: relative;
  overflow: hidden;
  width: 800px;
  max-width: 100%;
  min-height: 500px;
  color: #fff;
`;


const SignUpContainer = styled.div`
  background-color: #142748;
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${(props) =>
    props.signinIn !== true
      ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `
      : null}
`;

const SignInContainer = styled.div`
  background-color: #142748;
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${(props) =>
    props.signinIn !== true ? 'transform: translateX(100%);' : null}
`;

const Form = styled.form`
  background-color: #142748;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  color: #fff;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const Input = styled.input`
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5); /* Sleek, semi-transparent border */
  border-radius: 10px; /* Rounded corners */
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  color: #fff;
  caret-color: #5e60ce; /* Keep your caret color */
  transition: border 0.3s ease; /* Smooth transition for focus effect */

  &:focus {
    outline: none; /* Remove default outline */
    border-color: #5e60ce; /* Change border color on focus */
  }
`;


const TogglePassword = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #5e60ce;
  background-color: #5e60ce;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

const Anchor = styled.a`
  color: #fff;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${(props) =>
    props.signinIn !== true ? 'transform: translateX(-100%);' : null}
`;

const Overlay = styled.div`
  background: linear-gradient(to right, #F24B53, #8F5EB4); /* Updated gradient colors */
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${(props) =>
    props.signinIn !== true ? 'transform: translateX(50%);' : null}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props) =>
    props.signinIn !== true ? 'transform: translateX(0);' : null}
`;

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props) =>
    props.signinIn !== true ? 'transform: translateX(20%);' : null}
`;

const AlertBox = styled.div`
  position: fixed; /* Changed to fixed positioning */
  top: 20px; /* Adjusted position */
  left: 50%;
  transform: translateX(-50%);
  background-color: #5e60ce; /* Background color */
  color: #fff; /* White text color */
  padding: 10px 20px; /* Padding for spacing */
  border-radius: 5px; /* Rounded corners */
  z-index: 999; /* High z-index to appear on top */
  display: ${(props) => (props.visible ? 'block' : 'none')}; /* Show or hide based on state */
`;

const LoginSignup = () => {
  const [signIn, toggle] = useState(true);
  const [alert, setAlert] = useState({ message: '', visible: false });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleSignIn, setPasswordVisibleSignIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const database = getDatabase(app); // Initialize the database

  // Update handleSignUp to push name and email to Firebase Realtime Database
  const handleSignUp = async (event) => {
    event.preventDefault();
    const { name, email, password } = event.target.elements; // Get the name, email, and password
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
  
      // Push name, email, and other fields initialized to empty strings to Firebase Realtime Database
      await set(ref(database, 'users/' + user.uid), {
        name: name.value,
        email: email.value,
        age: '', // Initialize age to empty string
        dob: '', // Initialize dob to empty string
        department: '', // Initialize department to empty string
        year: '', // Initialize year to empty string
        registrationNumber: '', // Initialize registrationNumber to empty string
        rollNumber: '', // Initialize rollNumber to empty string
      });
  
      setAlert({ message: 'Successfully signed up!', visible: true });
      setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
      navigate('/midpage');
    } catch (error) {
      setAlert({ message: error.message, visible: true });
      setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
    }
  };
  

  const handleSignIn = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      setAlert({ message: 'You have successfully signed in!', success: true });
      navigate('/midpage');
    } catch (error) {
      setAlert({ message: error.message, success: false });
    }
  };

  return (
    <>
    <AlertBox visible={alert.visible}>{alert.message}</AlertBox>
    <CenteredContainer>
      <Container>
        {alert.message && <AlertBox success={alert.success}>{alert.message}</AlertBox>}
        <SignUpContainer signinIn={signIn}>
          <Form onSubmit={handleSignUp}>
            <Title>Create Account</Title>
            <Input type="text" placeholder="Name" name="name" />
            <Input type="email" placeholder="Email" name="email" />
            <InputWrapper>
              <Input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                name="password"
              />
              <TogglePassword onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </TogglePassword>
            </InputWrapper>
            <Button type="submit">Sign Up</Button>
          </Form>
        </SignUpContainer>

        <SignInContainer signinIn={signIn}>
          <Form onSubmit={handleSignIn}>
            <Title>Sign in</Title>
            <Input type="email" placeholder="Email" name="email" />
            <InputWrapper>
              <Input
                type={passwordVisibleSignIn ? 'text' : 'password'}
                placeholder="Password"
                name="password"
              />
              <TogglePassword onClick={() => setPasswordVisibleSignIn(!passwordVisibleSignIn)}>
                {passwordVisibleSignIn ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </TogglePassword>
            </InputWrapper>
            <Button type="submit">Sign In</Button>
          </Form>
        </SignInContainer>

        <OverlayContainer signinIn={signIn}>
          <Overlay signinIn={signIn}>
            <LeftOverlayPanel signinIn={signIn}>
              <Title>Welcome Back!</Title>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <GhostButton onClick={() => toggle(true)}>
                Sign In
              </GhostButton>
            </LeftOverlayPanel>

            <RightOverlayPanel signinIn={signIn}>
              <Title>Hello, Friend!</Title>
              <p>Enter your personal details and start journey with us</p>
              <GhostButton onClick={() => toggle(false)}>
                Sign Up
              </GhostButton>
            </RightOverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
    </CenteredContainer>
    <></></>
  );
};

export default LoginSignup;
