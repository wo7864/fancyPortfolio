//
// these easing functions are based on the code of glsl-easing module.
// https://github.com/glslify/glsl-easings
//

const ease = {
    exponentialIn: (t) => {
      return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
    },
    exponentialOut: (t) => {
      return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
    },
    exponentialInOut: (t) => {
      return t == 0.0 || t == 1.0
        ? t
        : t < 0.5
          ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
          : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
    },
    sineOut: (t) => {
      const HALF_PI = 1.5707963267948966;
      return Math.sin(t * HALF_PI);
    },
    circularInOut: (t) => {
      return t < 0.5
          ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
          : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
    },
    cubicIn: (t) => {
      return t * t * t;
    },
    cubicOut: (t) => {
      const f = t - 1.0;
      return f * f * f + 1.0;
    },
    cubicInOut: (t) => {
      return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    },
    quadraticOut: (t) => {
      return -t * (t - 2.0);
    },
    quarticOut: (t) => {
      return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
    },
  }
  

/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
	setTimeout(() => document.body.classList.add('render'), 60);
	const navdemos = Array.from(document.querySelectorAll('nav.demos > .demo'));
	const total = navdemos.length;
	const current = navdemos.findIndex(el => el.classList.contains('demo--current'));
	const navigate = (linkEl) => {
		document.body.classList.remove('render');
		document.body.addEventListener('transitionend', () => window.location = linkEl.href);
	};
	navdemos.forEach(link => link.addEventListener('click', (ev) => {
		ev.preventDefault();
		navigate(ev.target);
	}));
	document.addEventListener('keydown', (ev) => {
		const keyCode = ev.keyCode || ev.which;
		let linkEl;
		if ( keyCode === 37 ) {
			linkEl = current > 0 ? navdemos[current-1] : navdemos[total-1];
		}
		else if ( keyCode === 39 ) {
			linkEl = current < total-1 ? navdemos[current+1] : navdemos[0];
		}
		else {
			return false;
		}
		navigate(linkEl);
	});
}


class ShapeOverlays {
    constructor(elm) {
      this.elm = elm;
      this.path = elm.querySelectorAll('path');
      this.numPoints = 2;
      this.duration = 600;
      this.delayPointsArray = [];
      this.delayPointsMax = 0;
      this.delayPerPath = 200;
      this.timeStart = Date.now();
      this.isOpened = false;
      this.isAnimating = false;
    }
    toggle() {
      this.isAnimating = true;
      for (var i = 0; i < this.numPoints; i++) {
        this.delayPointsArray[i] = 0;
      }
      if (this.isOpened === false) {
        this.open();
      } else {
        this.close();
      }
    }
    open() {
      this.isOpened = true;
      this.elm.classList.add('is-opened');
      this.timeStart = Date.now();
      this.renderLoop();
    }
    close() {
      this.isOpened = false;
      this.elm.classList.remove('is-opened');
      this.timeStart = Date.now();
      this.renderLoop();
    }
    updatePath(time) {
      const points = [];
      for (var i = 0; i < this.numPoints; i++) {
        const thisEase = this.isOpened ? 
                          (i == 1) ? ease.cubicOut : ease.cubicInOut:
                          (i == 1) ? ease.cubicInOut : ease.cubicOut;
        points[i] = thisEase(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
      }
  
      let str = '';
      str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
      for (var i = 0; i < this.numPoints - 1; i++) {
        const p = (i + 1) / (this.numPoints - 1) * 100;
        const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
        str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
      }
      str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
      return str;
    }
    render() {
      if (this.isOpened) {
        for (var i = 0; i < this.path.length; i++) {
          this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
        }
      } else {
        for (var i = 0; i < this.path.length; i++) {
          this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
        }
      }
    }
    renderLoop() {
      this.render();
      if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
        requestAnimationFrame(() => {
          this.renderLoop();
        });
      }
      else {
        this.isAnimating = false;
      }
    }
  }
  
  (function() {
    const open_btn_list = Array.from(document.querySelectorAll('.page-open'));
    const back_list = Array.from(document.querySelectorAll('.back-btn'));
    const more = document.querySelector('.page-1-more');
    const gNavItems = [];
    for(let i=1; i<=4; i++){
      target = Array.from(document.querySelectorAll('.page-'+ i +'__item'));
      target = target.concat(Array.from(document.querySelectorAll('.page-'+ i +'__front-item')));

      gNavItems.push(target);
    }
    const overlay_list = [];

    for(let i=1;i<=4;i++){
      overlay_list.push(
        new ShapeOverlays(document.querySelector('.page-'+ i +'-overlays'))
      );
    }
    
    
  
    open_btn_list.forEach((btn, pos) => {
      btn.addEventListener('click', () => {
        back_list[pos].style.pointerEvents = 'auto';
        more.style.pointerEvents = 'pointer';
        if (overlay_list[pos].isAnimating) {
          return false;
        }
        overlay_list[pos].toggle();
        if (overlay_list[pos].isOpened === true) {
          for (var i = 0; i < gNavItems[pos].length; i++) {
            gNavItems[pos][i].classList.add('is-opened');
          }
        } else {
          for (var i = 0; i < gNavItems.length; i++) {
            gNavItems[pos][i].classList.remove('is-opened');
          }
        }
      });
    });
    more.addEventListener('click', () =>{

      const front_contents = Array.from(document.querySelectorAll('.page-1__front-item'));
      const back_contents = Array.from(document.querySelectorAll('.page-1__back-item'));

      front_contents.forEach((text, pos) => {
        charming(text);    
        anime({
            targets: text.querySelectorAll('span'),
            duration: 800,
            delay: (t,i) => anime.random(0,600),
            easing: 'easeInOutQuad',
            opacity: [1,0],
            complete: () => {
                text.style.pointerEvents = 'auto';
                text.classList.remove('is-opened');
                text.classList.add('is-invisiable');
                back_contents.forEach((text2, pos2) => {
                  text2.classList.remove('is-invisiable');
                  text2.classList.add('is-opened');
                });
            }
        });
      });

      back_contents.forEach((text, pos2) => {
        charming(text);
        anime({
            targets: text.querySelectorAll('span'),
            duration: 800,
            delay: (t,i) => anime.random(0,600)+900,
            easing: 'easeInOutQuad',
            opacity: [0,1],
            complete: () => {
                text.style.pointerEvents = 'auto';

            }
        });
      });
    });
    
    back_list.forEach((back, pos) => {
      back.addEventListener('click', () => {
        back_list[pos].style.pointerEvents = 'none';

        if (overlay_list[pos].isAnimating) {
          return false;
        }
        overlay_list[pos].toggle();
        if (overlay_list[pos].isOpened === true) {
          for (var i = 0; i < gNavItems[pos].length; i++) {
            gNavItems[pos][i].classList.add('is-opened');
          }
        } else {
          for (var i = 0; i < gNavItems[pos].length; i++) {
            gNavItems[pos][i].classList.remove('is-opened');
          }
        }
      });
    });


  }());
  