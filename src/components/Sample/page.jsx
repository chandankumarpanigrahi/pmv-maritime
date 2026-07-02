import React from "react";
import styles from "./style.module.css";

export default function Sample() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sample Component</h2>
      <p className={styles.description}>
        This is a sample component styled using a CSS module and utilizing the global theme variables.
      </p>
      <button className="btn btn-cerulean">Action Button</button>
    </div>
  );
}
