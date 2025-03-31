import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";

// Mock useCurrentUser and useSetCurrentUser
jest.mock("../../contexts/CurrentUserContext", () => ({
  useCurrentUser: jest.fn(),
  useSetCurrentUser: jest.fn(),
}));

test("renders NavBar", () => {
  render(
    <Router>
      <NavBar />
    </Router>
  );

  const signInLink = screen.getByRole("link", { name: "Sign in" });
  expect(signInLink).toBeInTheDocument();
});

test("renders link to the user profile for a logged-in user", async () => {
  // Mock a logged-in user
  useCurrentUser.mockReturnValue({ username: "testuser", profile_image: "test.jpg" });

  render(
    <Router>
      <NavBar />
    </Router>
  );

  const profileAvatar = await screen.findByText("Profile");
  expect(profileAvatar).toBeInTheDocument();
});

test("renders Sign in and Sign up buttons again on log out", async () => {
  const mockSetCurrentUser = jest.fn();
  useCurrentUser.mockReturnValue({ username: "testuser" }); // Mock logged-in state
  useSetCurrentUser.mockReturnValue(mockSetCurrentUser); // Mock log-out function

  render(
    <Router>
      <NavBar />
    </Router>
  );

  const signOutLink = await screen.findByRole("link", { name: "Sign out" });
  fireEvent.click(signOutLink);

  // Simulate user logout
  useCurrentUser.mockReturnValue(null);
  render(
    <Router>
      <NavBar />
    </Router>
  );

  const signInLink = await screen.findByRole("link", { name: "Sign in" });
  const signUpLink = await screen.findByRole("link", { name: "Sign up" });

  expect(signInLink).toBeInTheDocument();
  expect(signUpLink).toBeInTheDocument();
});
