import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import './ForgotPasswordDialog.css'; 
import {auth} from '../firebase/config.js';
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordDialog = ({ open, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = data => {
    console.log('Sending password reset email to:', data.email);
    // Логика отправки писем
    sendPasswordResetEmail(auth, data.email);
    alert('Email sent! Check your inbox for password reset instructions.')
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form">
          <TextField
            id="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            className="text-field"
          />
          <DialogActions>
            <Button onClick={onClose} className="cancel-button">Cancel</Button>
            <Button type="submit" className="submit-button">Send Email</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
