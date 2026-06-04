import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { PreprouteLogo } from '../components/brand/PreprouteLogo';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import styles from './LoginPage.module.css';

const schema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { userId: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError('');
    try {
      const result = await login(data.userId, data.password);
      setAuth(result.token, result.user);
      navigate('/dashboard');
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.illustration}>
        <img
          src="/login-illustration.svg"
          alt="Classroom illustration with teacher and students"
          className={styles.illustrationImg}
        />
      </div>
      <div className={styles.formPanel}>
        <div className={styles.card}>
          <PreprouteLogo size="lg" className={styles.logo} />
          <h1>Login</h1>
          <p className={styles.subtitle}>
            Use your company provided Login credentials
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
            noValidate
          >
            <Input
              label="User ID"
              placeholder="Enter User ID"
              required
              error={errors.userId?.message}
              {...register('userId')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter Password"
              required
              error={errors.password?.message}
              {...register('password')}
            />
            <a href="#forgot" className={styles.forgot}>
              Forgot password?
            </a>
            {apiError ? <div className={styles.apiError}>{apiError}</div> : null}
            <Button type="submit" loading={isSubmitting} className={styles.submit}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
