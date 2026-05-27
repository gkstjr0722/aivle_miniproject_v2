import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ListPage({ books, tags }) {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';

  const [selectedTags, setSelectedTags] = useState(['없음']);
  useEffect(()=>{
    if (!tags || tags.length === 0) {
      return;
    }

    setSelectedTags([...tags, "없음"]);}
    ,[tags])

  const filteredBooks = books.filter((book) =>
  {
    const keyward_bool = book.title
      .toLowerCase()
      .includes(keyword.toLowerCase())
    let tag_bool = true;
    if (selectedTags.includes('없음'))
      tag_bool = (!book.tag || book.tag.length === 0) 
      ? true : selectedTags.some(t => book.tag.includes(t));
    else
      tag_bool =  (!book.tag || book.tag.length === 0) 
      ? false : selectedTags.some(t => book.tag.includes(t) )

      return keyward_bool && tag_bool
  }
  );
  const [sortType, setSortType] = useState('latest');

  const sortedBooks = [...filteredBooks].sort((a, b) => {

    if (sortType === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortType === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sortType === 'likes') {
      return b.likes - a.likes;
    }

    return 0;
  });

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t=>t!==tag)); 
    } else {
      setSelectedTags([...selectedTags, tag]); 
    }
  };

  return (
    <div className="list-page">

      <div className="sort-menu">
          {keyword && (

            <div className="search-result-title">

              "{keyword}" 검색 결과

              ({sortedBooks.length}권)

            </div>

          )}
        <button
          className={sortType === 'latest' ? 'active' : ''}
          onClick={() => setSortType('latest')}
        >
          최신순
        </button>

        <button
          className={sortType === 'title' ? 'active' : ''}
          onClick={() => setSortType('title')}
        >
          이름순
        </button>

        <button
          className={sortType === 'likes' ? 'active' : ''}
          onClick={() => setSortType('likes')}
        >
          좋아요순
        </button>

      {/* ─── 태그 한 줄 출력 영역 ─── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['없음',...tags].map((t) => {
          const isSelected = selectedTags.includes(t); 
          return (
            <span
              key={t}
              onClick={() => handleTagClick(t)}
              style={{
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                // 🔥 On/Off 상태에 따라 스타일 변화 (예: 선택되면 파란색/굵게)
                backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
                color: isSelected ? '#fff' : '#333',
                fontWeight: isSelected ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}
            >
              #{t}
            </span>
          );
        })}
  
      </div>
      </div>
      <div className="book-list">

        {sortedBooks.length === 0 ? (

          <div className="empty-result">
            검색 결과가 없습니다.
          </div>

        ) : (

          sortedBooks.map((book) => (
            <div
              className="book-card"
              key={book.id}
            >
              <Link
                to={`/detail/${book.id}`}
                className="image-link"
              >
                <div className="image-wrap">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                  />
                </div>
              </Link>
              <div className="book-content">
                <h2>
                  {book.title}
                </h2>
                <span className="search-author">
                  {book.author}
                </span>
                <div className="book-like">
                  ❤️ {book.likes}
                </div>
              </div>
            </div>
          ))

        )}

      </div>

    </div>
  );
}

export default ListPage;