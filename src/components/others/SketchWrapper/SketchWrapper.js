import React from 'react';
import p5 from 'p5';
import * as styles from '@styles/explicit.module.css';

export default function SketchWrapper({ sketch }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const myP5 = new p5(sketch, ref.current);
    if (myP5.mousePressed != null) {
      const mousePressed = myP5.mousePressed;
      myP5.mousePressed = null;
      ref.current.addEventListener('click', () => {
        mousePressed();
      });
    }
    if (myP5.keyTyped != null) {
      const keyTyped = myP5.keyTyped;
      myP5.keyTyped = null;
      document.addEventListener('keydown', () => {
        if (!(0 <= myP5.mouseX && myP5.mouseX <= myP5.width)) return;
        if (!(0 <= myP5.mouseY && myP5.mouseY <= myP5.height)) return;
        keyTyped();
      });
    }
  }, [sketch, ref]);
  return <div className={styles.sketchWrapper} ref={ref} />;
};
