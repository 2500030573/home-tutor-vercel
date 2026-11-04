import { useState, useEffect } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('loggedInUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('loggedInUser');
    if (!saved) return 'login';
    return JSON.parse(saved).role === 'admin' ? 'admin' : 'student';
  });

  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem('users')) || [];
  });

  const [tutors, setTutors] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('tutorsList'));
    if (saved && saved.length > 0) return saved;
    const defaults = [
      { name: 'Mr. Charan', subject: 'Math', city: 'Hyderabad', rate: 600 },
      { name: 'Ms. Priya', subject: 'English', city: 'Mumbai', rate: 500 },
    ];
    localStorage.setItem('tutorsList', JSON.stringify(defaults));
    return defaults;
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('student');

  // Admin form state
  const [tutorName, setTutorName] = useState('');
  const [tutorSubject, setTutorSubject] = useState('');
  const [tutorCity, setTutorCity] = useState('');
  const [tutorRate, setTutorRate] = useState('');

  // Student search filters
  const [searchSubject, setSearchSubject] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupUsername || !signupPassword) {
      alert('Please fill all fields');
      return;
    }
    if (users.some((u) => u.username === signupUsername)) {
      alert('Username already exists!');
      return;
    }

    const newUser = {
      username: signupUsername,
      password: signupPassword,
      role: signupRole,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Signup successful! Please login.');
    setSignupUsername('');
    setSignupPassword('');
    setCurrentView('login');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === loginUsername && u.password === loginPassword
    );

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      setCurrentUser(user);
      setLoginUsername('');
      setLoginPassword('');
      setCurrentView(user.role === 'admin' ? 'admin' : 'student');
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleAddTutor = (e) => {
    e.preventDefault();
    if (!tutorName || !tutorSubject || !tutorCity || !tutorRate) {
      alert('Fill all fields');
      return;
    }

    const newTutor = {
      name: tutorName,
      subject: tutorSubject,
      city: tutorCity,
      rate: Number(tutorRate),
    };
    const updatedTutors = [...tutors, newTutor];
    setTutors(updatedTutors);
    localStorage.setItem('tutorsList', JSON.stringify(updatedTutors));

    alert('Tutor added successfully!');
    setTutorName('');
    setTutorSubject('');
    setTutorCity('');
    setTutorRate('');
  };

  const filteredTutors = tutors.filter((t) => {
    const matchSubject = t.subject
      .toLowerCase()
      .includes(searchSubject.toLowerCase());
    const matchCity = t.city.toLowerCase().includes(searchCity.toLowerCase());
    return matchSubject && matchCity;
  });

  return (
    <>
      <header>
        <div className="nav-container">
          <div className="brand">
            <h1>
              🎓{' '}
              {currentUser
                ? currentUser.role === 'admin'
                  ? 'Admin Dashboard'
                  : 'Student Dashboard'
                : 'Home Tutor Finder'}
            </h1>
          </div>
          <nav>
            {!currentUser ? (
              currentView === 'login' ? (
                <button onClick={() => setCurrentView('signup')}>Sign Up</button>
              ) : (
                <button onClick={() => setCurrentView('login')}>Login</button>
              )
            ) : (
              <button onClick={handleLogout}>Logout</button>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* LOGIN VIEW */}
        {!currentUser && currentView === 'login' && (
          <form className="box" onSubmit={handleLogin}>
            <h3>Login</h3>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        )}

        {/* SIGNUP VIEW */}
        {!currentUser && currentView === 'signup' && (
          <form className="box" onSubmit={handleSignup}>
            <h3>Create an Account</h3>
            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <select
              value={signupRole}
              onChange={(e) => setSignupRole(e.target.value)}
            >
              <option value="student">Student (Find Tutors)</option>
              <option value="admin">Admin (Add Tutors)</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
        )}

        {/* ADMIN MODULE */}
        {currentUser && currentUser.role === 'admin' && (
          <form className="box" onSubmit={handleAddTutor}>
            <h3>Register a New Tutor</h3>
            <input
              type="text"
              placeholder="Tutor Name"
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Subject (e.g., Math)"
              value={tutorSubject}
              onChange={(e) => setTutorSubject(e.target.value)}
            />
            <input
              type="text"
              placeholder="City (e.g., Mumbai)"
              value={tutorCity}
              onChange={(e) => setTutorCity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Rate per hour (₹)"
              value={tutorRate}
              onChange={(e) => setTutorRate(e.target.value)}
            />
            <button type="submit" className="btn-green">
              Add Tutor to Database
            </button>
          </form>
        )}

        {/* STUDENT / USER MODULE */}
        {currentUser && currentUser.role === 'student' && (
          <>
            <div className="box">
              <h3>Find a Tutor</h3>
              <div className="search-inputs">
                <input
                  type="text"
                  placeholder="Subject..."
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
            </div>

            <div id="tutorList">
              {filteredTutors.length === 0 ? (
                <p>No tutors match your search criteria.</p>
              ) : (
                filteredTutors.map((t, idx) => (
                  <div key={idx} className="card">
                    <h3>{t.name}</h3>
                    <p>
                      <strong>Subject:</strong> {t.subject}
                    </p>
                    <p>
                      <strong>City:</strong> {t.city}
                    </p>
                    <p>
                      <strong>Rate:</strong> ₹{t.rate}/hr
                    </p>
                    <button onClick={() => alert(`Booked session with ${t.name}!`)}>
                      Book Tutor
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}