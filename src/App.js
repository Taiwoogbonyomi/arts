import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import SignInForm from "./pages/auth/SignIn";
import SignUpForm from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  
  const handleMount = async () => {
    try {
      const { data } = await axios.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <Router>
          <div className={styles.appContainer}>
            <NavBar />
            <Container fluid className={styles.main}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/signin" component={SignInForm} />
                <Route exact path="/signup" component={SignUpForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </div>
        </Router>
    </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
