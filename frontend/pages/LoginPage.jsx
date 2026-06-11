import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError('아이디 또는 비밀번호가 틀렸습니다.');
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      onLogin(username);
      navigate('/');
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">로그인</button>
      </form>
      <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
    </div>
  );
}

export default LoginPage;