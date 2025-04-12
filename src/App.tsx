import { PostProvider } from "./hooks/PostContext";
import AppRouter from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <PostProvider>
      <AppRouter />
    </PostProvider>
  );
}

export default App;
