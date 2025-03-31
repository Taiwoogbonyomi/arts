import styles from "../styles/NotFound.module.css";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const NotFound = () => {
  return (
    <>
      <div className={`${styles.NotFound} text-center`}>
        Sorry! This page doesn't exist. Click<Link to={"/"}> here </Link>to return to the homepage.
      </div>
      
    </>
  );
}

export default NotFound