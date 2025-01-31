import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import SignInForm from "./pages/auth/SignIn";
import SignUpForm from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import "./api/axiosDefaults";

function App() {
  return (
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
  );
}

export default App;
