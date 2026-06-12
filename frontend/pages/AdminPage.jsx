import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../components/api.js';

function AdminPage() {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('books');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'ADMIN') {
      alert('관리자만 접근 가능합니다.');
      navigate('/');
      return;
    }

    async function loadData() {
      try {
        const [b, r, u] = await Promise.all([
          request('/books'),
          request('/reviews'),
          request('/admin/users'),
        ]);
        setBooks(b || []);
        setReviews(r || []);
        setUsers(u || []);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const handleDeleteBook = async (id) => {
    if (!window.confirm('도서를 삭제하시겠습니까?')) return;
    try {
      await request(`/admin/books/${id}`, { method: 'DELETE' });
      setBooks(books.filter(b => b.id !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;
    try {
      await request(`/admin/reviews/${id}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2>관리자 페이지</h2>

      {/* 탭 메뉴 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setTab('books')} style={{ fontWeight: tab === 'books' ? 'bold' : 'normal' }}>
          도서 관리 ({books.length})
        </button>
        <button onClick={() => setTab('reviews')} style={{ fontWeight: tab === 'reviews' ? 'bold' : 'normal' }}>
          리뷰 관리 ({reviews.length})
        </button>
        <button onClick={() => setTab('users')} style={{ fontWeight: tab === 'users' ? 'bold' : 'normal' }}>
          회원 목록 ({users.length})
        </button>
      </div>

      {/* 도서 관리 */}
      {tab === 'books' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>제목</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>작가</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>작성자</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>좋아요</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{book.id}</td>
                <td style={{ padding: '8px' }}>{book.title}</td>
                <td style={{ padding: '8px' }}>{book.author}</td>
                <td style={{ padding: '8px' }}>{book.createdBy || '-'}</td>
                <td style={{ padding: '8px' }}>❤️ {book.likes}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleDeleteBook(book.id)} style={{ color: 'red' }}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 리뷰 관리 */}
      {tab === 'reviews' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>닉네임</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>내용</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>작성자</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>좋아요</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{review.id}</td>
                <td style={{ padding: '8px' }}>{review.nickname}</td>
                <td style={{ padding: '8px' }}>{review.content}</td>
                <td style={{ padding: '8px' }}>{review.createdBy || '-'}</td>
                <td style={{ padding: '8px' }}>❤️ {review.likes}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleDeleteReview(review.id)} style={{ color: 'red' }}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 회원 목록 */}
      {tab === 'users' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>아이디</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>권한</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{user.id}</td>
                <td style={{ padding: '8px' }}>{user.username}</td>
                <td style={{ padding: '8px' }}>{user.role}</td>
                <td style={{ padding: '8px' }}>{user.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;