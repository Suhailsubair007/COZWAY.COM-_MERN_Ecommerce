import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/Store.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="513679672294-fpkd33ian9rm0r99p98311tl4g42ulsm.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
);
