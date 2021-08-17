import React from 'react';
import p5 from 'p5';
import * as styles from '@styles/explicit.module.css';

export default function SketchWrapper({ sketch }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const myP5 = new p5(sketch, ref.current);
    ref.current.children[0].style.borderRadius = '.5rem';
    if (myP5.mousePressed != null) {
      const mousePressed = myP5.mousePressed;
      myP5.mousePressed = null;
      ref.current.addEventListener('click', () => {
        mousePressed();
      });
    }
    if (myP5.keyPressed != null) {
      const keyPressed = myP5.keyPressed;
      myP5.keyPressed = () => {
        if (!(0 <= myP5.mouseX && myP5.mouseX <= myP5.width)) return;
        if (!(0 <= myP5.mouseY && myP5.mouseY <= myP5.height)) return;
        keyPressed();
      };
    }
  }, [sketch, ref]);
  return <div className={styles.sketchWrapper} ref={ref} />;
};