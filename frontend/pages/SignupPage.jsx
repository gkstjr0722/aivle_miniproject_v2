
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || '회원가입 실패');
        return;
      }
      alert('회원가입 성공! 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h2>회원가입</h2>
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
        <button type="submit">회원가입</button>
      </form>
      <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
    </div>
  );
}

export default SignupPage;