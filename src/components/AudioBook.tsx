import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flipper, Flipped } from 'react-flip-toolkit';
import '../App.css';

interface Book {
  id: number;
  title: string;
  author: string;
  votes: number;
  image: string;
  genre: string[];
}

const AudioBook = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();

  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://audiobook-server.onrender.com/books');
      const sortedBooks = response.data.sort((a: Book, b: Book) => b.votes - a.votes);
      setBooks(sortedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleVote = async (bookId: number) => {
    try {
      await axios.post(`https://audiobook-server.onrender.com/books/${bookId}/vote`);
      setBooks((prevBooks) => {
        const updatedBooks = prevBooks.map((book) =>
          book.id === bookId ? { ...book, votes: book.votes + 1 } : book
        );
        return updatedBooks.sort((a, b) => b.votes - a.votes);
      });
    } catch (error) {
      console.error('Error voting for book:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-2xl sm:text-4xl mb-5 text-center md:text-left">
        <span className="font-bold text-brown">
          Featured Audio Books
        </span>
      </h1>
      <Flipper flipKey={books.map(book => book.id).join('')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
          {books.map((book) => (
            <Flipped key={book.id} flipId={book.id}>
              <div className="audiobook-item bg-gray-800 p-4 rounded-lg shadow-lg">
                <img className="w-full h-48 object-cover rounded-md" src={book.image} alt={book.title} />
                <div className="flex justify-between items-center mt-2 gap-2">
                  <h3 className="text-lg font-bold">
                    {book.title.length > 40 ? `${book.title.substring(0, 20)}...` : book.title}
                  </h3>
                  <svg onClick={() => handleVote(book.id)} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white inline-block mr-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>

                <p className="text-sm text-gray-400">{book.author}</p>
                <div className="flex items-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.049 8.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  <span className="ml-1">{book.votes}</span>
                </div>
                <div className="flex flex-wrap mt-2">
                  {book.genre.map((genre, index) => (
                    <span key={index} className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                      {genre}
                    </span>
                  ))}
                </div>

              </div>
            </Flipped>
          ))}
        </div>
      </Flipper>
    </div>
  );
};

export default AudioBook;