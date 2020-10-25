// Global Helpers Obj
const globalObj = {
   status: {
      oldScrollVal: 0,
      floIconsPos: 0,
      animUp: false,
      animDown: false,
      setCopies: false,
      categoryPos: [],
      categoryIndex: 0,
      navDropListHeight: 0,
      navigationSpeed: 10,
      navigationSmooth: 50,
      sectionPos: [],
      sectionList: [],
      caroItemNum: 2
   },
   closest: function(ele, name) {
      while (ele !== document.querySelector('html')) {
         if (name[0] !== '.' && name[0] !== '#') {
            if (ele.tagName.toLowerCase() === name) {
               return ele;
            } else {
               ele = ele.parentElement;
            }
         } else if (name[0] === '.') {
            if (ele.classList.contains(name.slice(1))) {
               return ele;
            } else {
               ele = ele.parentElement;
            }
         } else if (name[0] === '#') {
            if (ele.id === name.slice(1)) {
               return ele;
            } else {
               ele = ele.parentElement;
            }
         }
      }
      if (ele === document.querySelector('html')) {
         return false;
      }
   },
   onResize: function() {
      // Get Navbar DropList Height
      navbarFun(['resize'], null);

      // Set Header Height to Full window Height
      headerSectionFun(['resize']);

      // Set Float Icons position on resize
      globalObj.setFlotIconsPos();

      // Position category
      servicesSectionFun(['resize']);

      // Review Section
      reviewsSectionFun(['resize']);

   },
   valAnim: function(status, ele, max, min, prop, smooth, speed, callback) {
      let anim, counter;
      clearInterval(anim)
      if (status === 'type1') { // Increase Animation
         anim = setInterval(frame, speed);
             counter = min;
         ele.style[prop] = min + 'px';
         function frame() {
            if (counter >= max) {
               ele.style[prop] = max + 'px';
               clearInterval(anim);
               if (callback !== null) {
                  callback();
               }
            } else {
               counter += smooth;
               ele.style[prop] = counter + 'px';
            }
         }
      } else if (status === 'type2') { // Decrease Animation
         anim = setInterval(frame, speed);
             counter = max;
         function frame() {
            if (counter <= min) {
               ele.style[prop] = min + 'px';
               clearInterval(anim);
               if (callback !== null) {
                  callback();
               }
            } else {
               counter -= smooth;
               ele.style[prop] = counter + 'px';
            }
         }
      } else { // Decrease Negative
         anim = setInterval(frame, speed),
             counter = max;
         function frame() {
            if (counter <= min) {
               ele.style[prop] = min + 'px';
               clearInterval(anim);
               if (callback !== null) {
                  callback();
               }
            } else {
               counter -= smooth;
               ele.style[prop] = counter + 'px';
            }
         }
      }
   },
   setFlotIconsPos: function() { // Set Float Icons Position
      if (window.innerWidth > 767 && document.querySelector('.floating-social-icons')) {
         const floatSoicalIcons = document.querySelector('.floating-social-icons');
         if (!globalObj.status.setCopies && document.querySelector('.copy-social-icons')) {
            let containers = Array.from([...document.querySelectorAll('.copy-social-icons')]);
            containers.filter(function(ele) {
               if (!ele.querySelector('.floating-social-icons')) {
                  let floatSocialIconsCopy = floatSoicalIcons.cloneNode(true);
                  // Clone Header Social Icons
                  ele.appendChild(floatSocialIconsCopy);
               }
            });
            // Get Header Float Icons Position
            globalObj.status.floIconsPos = floatSoicalIcons.getBoundingClientRect().top + window.scrollY;
            globalObj.status.setCopies = true;
         }

         // Set Floating social icons position on scroll  
         const iconsPos = globalObj.status.floIconsPos,
               allFloatIcons = document.querySelectorAll('.floating-social-icons');
         for (let i = 0; i < allFloatIcons.length; i++) {
            if (i === 0) {
               allFloatIcons[i].style.top = iconsPos + window.pageYOffset + 'px';
            } else {
               let mainSection = globalObj.closest(allFloatIcons[i], '.main-section');
               allFloatIcons[i].style.top = (window.pageYOffset - mainSection.getBoundingClientRect().top - window.pageYOffset + iconsPos) + 'px';
            }
         }
               
         // Hide/show float icons
         if (document.querySelector('.free-floaticons-btm')) {
            let freeIcons = document.querySelectorAll('.free-floaticons-btm');
            for (let i = 0; i < freeIcons.length; i++) {
               if (freeIcons[i].previousElementSibling.classList.contains('main-section')) {
                  let prevSection = freeIcons[i].previousElementSibling;
                  if (((window.innerHeight * 0.5) + 158.5) > (Math.abs(prevSection.getBoundingClientRect().top))) {
                     freeIcons[i].style.overflow = 'hidden';
                  } else {
                     freeIcons[i].style.overflow = 'inherit';
                  }
               }
            }
         }

      }
   },
   showHideNav: function(self, navbar, navHeight) { // Collapse navbar in mobile screen
      // Show/hid navbar
      if ((self.scrollY < globalObj.status.oldScrollVal) && self.scrollY > 350) { // Scroll backward
         if (!navbar.classList.contains('position-fixed') && !globalObj.status.animDown) {
            globalObj.status.animDown = true;
            navbar.classList.add('position-fixed');
            navbar.classList.remove('position-absolute');
            globalObj.valAnim('type1', navbar, 0, -navHeight, 'top', 8, 10, function() {
               globalObj.status.animDown = false;
            });
         }
      } else if ((self.scrollY > globalObj.status.oldScrollVal) || self.scrollY < 350) { // Scroll forward
         if (!navbar.classList.contains('position-absolute') && !globalObj.status.animUp) {
            globalObj.status.animUp = true;
            globalObj.valAnim('type3', navbar, 0, -navHeight, 'top', 5, 10, function() {
               navbar.classList.remove('position-fixed');
               navbar.classList.add('position-absolute');
               globalObj.status.animUp = false;
            });
         }
      }
      globalObj.status.oldScrollVal = self.scrollY
   },
   getNavDropListHeight: function(navbar) { // Get nvbar list height in mobile
      if (window.innerWidth <= 767 && globalObj.status.navDropListHeight === 0) {
         let list = navbar.querySelector('.navbar-collapse');
         list.classList.add('getheight');
         globalObj.status.navDropListHeight = list.offsetHeight;
         setTimeout(function() {
            list.classList.remove('getheight');
         }, 50);
      }
   },
   navbarNavigation: function(link, btm) { // navigation on links click
      let section,sectionPos,winPos,status;
      winPos = window.scrollY;
      if (btm) {
         section = document.querySelector('.' + link.getAttribute('href').slice(1)),
         sectionPos = document.querySelector('.' + link.getAttribute('href').slice(1)).offsetTop - 30;
      } else {
         sectionPos = 0;
      }
      if (btm || window.scrollY !== sectionPos) {
         let animation = setInterval(frame, globalObj.status.navigationSpeed);
         if (winPos > sectionPos && !btm) {
            // Go Up
            status = false;
         } else {
            // Go Down
            status = true;
         }
         function frame() {
            if (status) {
               if (winPos >= sectionPos) {
                  clearInterval(animation);
               } else {
                  winPos += globalObj.status.navigationSmooth;
                  window.scrollTo(0, winPos);
               }
            } else {
               if (winPos <= sectionPos) {
                  clearInterval(animation);
               } else {
                  winPos -= globalObj.status.navigationSmooth;
                  window.scrollTo(0, winPos);
               }
            }
         }
      }
   },
   carousel: function() {
      $('.owl-carousel').owlCarousel({
         dots: true,
         items: globalObj.status.caroItemNum
      });
   },
   carouselResize: function() {
      if (window.innerWidth <= 850 && globalObj.status.caroItemNum === 2) { // Small Screen 1 item
         globalObj.status.caroItemNum = 1
         globalObj.status.carouselDestroySm = true;
         globalObj.status.carouselDestroyBg = false;
         $('.owl-carousel').trigger('destroy.owl.carousel');
         globalObj.carousel();
      } else if (window.innerWidth > 850 && globalObj.status.caroItemNum === 1) { // Big Screen 2 items
         globalObj.status.caroItemNum = 2;
         globalObj.status.carouselDestroySm = false;
         globalObj.status.carouselDestroyBg = true;
         $('.owl-carousel').trigger('destroy.owl.carousel');
         globalObj.carousel();
      }
   },
   loaderFun: function() { // Loader
      let loader = document.querySelector('.loader-container');
      if (document.querySelector('.services-section .category-list')) {
         document.querySelector('.services-section .category-list').classList.add('active')
      }
      document.body.classList.add('ready');
      loader.classList.add('active');
      setTimeout(function() {
         loader.classList.add('active2');
         setTimeout(function() {
            // Call typed function
            // Startup page
            headerSectionFun(['type-plugin']);
            setTimeout(function() {
               loader.remove();
               // Animation on scroll
               AOS.init({
                  offset: window.innerHeight * 0.2,
                  duration: 1000,
                  once: true
               });
               setTimeout(function() {
                  // Check services section animtion and active popup
                  servicesSectionFun(['scroll']);
               }, 1500);
            }, 1000);
         },500);
      }, 300);
   },
   checkAllImg: function() { // Check if all images loaded
      if (document.querySelector('img')) {
         let images = document.querySelectorAll('img'),
            list = Array.from([...images]),
            counter = 0,
            status = false;
         list.filter(function(img) {
            if (img.complete) {
               counter++;
               if (counter === list.length) {
                  status = true;
               }
            }
         });
         if (status) {
            // Call loader function
            globalObj.loaderFun();
         } else {
            setTimeout(function() {
               // Call again
               globalObj.checkAllImg();
            }, 20);
         }
      } else {
         // Call loader function
         globalObj.loaderFun();
      }
   }

};

// *** Init ***

// Get window scroll
globalObj.status.oldScrollVal = window.pageYOffset;

// *** Load Layout ***

(function() {
   'use strict';
   // Load GlobalObj
   globalObj.onResize();

   // Load All Sections
   loadAllSections();

   // Check if all fonts loaded
   document.fonts.ready.then(function() {
      // Check If all images loaded
      globalObj.checkAllImg();
   });

}());


// *** Events ***

// on resize
window.onresize = function() {
   globalObj.onResize();
}

// on scroll
window.addEventListener('scroll', function() {

   // Set Floating social icons position on scroll
   globalObj.setFlotIconsPos();

   // Show Hide Navbar
   navbarFun(['scroll'], this);
   
   // Check services section animtion and active popup
   servicesSectionFun(['scroll']);

});

// on load
window.onload = function() {
   // Set category
   servicesSectionFun(['load']);
}

// **** Load All Sections ****
function loadAllSections() {
   // Navbar
   navbarFun(['init'], null);
   // Header
   headerSectionFun(['init']);
   // Services
   servicesSectionFun(['init']);
   // talk
   talkSectionFun(['init']);
   // Reiviews
   reviewsSectionFun(['init']);
}

// **** Navbar ****
function navbarFun(arr, self) {
   if (document.querySelector('nav.navbar')) {
      const navbar = document.querySelector('nav.navbar'),
            navHeight = navbar.offsetHeight,
            navMobBtn = navbar.querySelector('button.navbar-toggler');
      
      // Init
      if (arr.includes('init')) {
         // On click Mob button
         navMobBtn.addEventListener('click', function() {
            let list = navbar.querySelector('.navbar-collapse');
            if (!navbar.classList.contains('active')) {
               navbar.classList.add('active');
               // Slide Down
               globalObj.valAnim('type1', list, globalObj.status.navDropListHeight, 0, 'height', 5, 5, null);
            } else {
               // Slide Up
               globalObj.valAnim('type2', list, globalObj.status.navDropListHeight, 0, 'height', 5, 5, function() {
                  navbar.classList.remove('active');
               });
            }
         });
      }

      // On Scroll
      if (arr.includes('scroll')) {
         // Show Hide Navbar on scroll
         globalObj.showHideNav(self, navbar, navHeight);
      }

      // On Resize
      if (arr.includes('resize')) {
         // Get Navbar DropList Height
         globalObj.getNavDropListHeight(navbar);
      }
   }
}

// *** Header ***
function headerSectionFun(arr) {
   if (document.querySelector('header.header-section')) {
      const section = document.querySelector('header.header-section'),
            headerFloatSocialIcons = section.querySelector('.floating-social-icons'),
            headerBtn = section.querySelector('.btn-container .btn');
      // Init
      if (arr.includes('init')) {
         // Scroll to Services Section on click on btn
         headerBtn.addEventListener('click', function(e) {
            globalObj.navbarNavigation(this, true);
         });
      }

      // On Resize
      if (arr.includes('resize')) {
         // Set Header Height to Full window Height
         if (window.innerHeight > 789) {
            section.style.height = window.innerHeight + 'px';
         } else if (window.innerWidth > 991) {
            section.style.minHeight = window.innerHeight + 'px';
            section.style.height = 'initial';
         } else if (window.innerWidth > 767) {
            section.style.minHeight = '620px';
            section.style.height = 'initial';
         }

         // Set Floating social icons position on Resize Window
         headerFloatSocialIcons.style.top = 'auto';
         globalObj.status.floIconsPos = headerFloatSocialIcons.getBoundingClientRect().top + window.scrollY;
      }

      // Typed plugin
      if (arr.includes('type-plugin')) {
         section.querySelector('#typed-strings').style.display = 'block';
         // Typed plugin
         lettyped = new Typed('#typed', {
            stringsElement: '#typed-strings',
            typeSpeed: 30,
            backSpeed: 30,
            backDelay: 100
         });
      }

   }
}

// *** Services Section ***
function servicesSectionFun(arr) {
   if (document.querySelector('section.services-section')) {
      let   section = document.querySelector('section.services-section'),
            category = section.querySelector('.inner-category'),
            categoryChild = category.children,
            categoryOverlay = section.querySelector('.category-overlay'),
            categoryBoxContainer = section.querySelector('.category-list'),
            categoryBox = section.querySelectorAll('.category-box .box');
      
      // Init
      if (arr.includes('init')) {
         // On Click Category button
         category.addEventListener('click', function(e) {
            if (globalObj.closest(e.target, '.category')) {
               let btn = globalObj.closest(e.target, '.category');
               globalObj.status.categoryIndex = Array.prototype.slice.call(this.children).indexOf(btn);
               if (!btn.classList.contains('active')) {
                  // Set overlay position
                  setStyle();
                  let self = this;
                  setTimeout(function() {
                     self.querySelector('.category.active').classList.remove('active');
                     self.querySelector('.icon.active').classList.remove('active');
                     setTimeout(function() {
                        btn.classList.add('active');
                        setTimeout(function() {
                           btn.querySelector('.icon').classList.add('active');
                        }, 100);
                     }, 50);
                  }, 50);

                  // Show/hide Category List
                  categoryBoxContainer.querySelector('.category-box.active').classList.remove('active');
                  categoryBoxContainer.children[globalObj.status.categoryIndex].classList.add('active');
               }
            }
         });

         // Category Box on hover
         for (let i = 0; i < categoryBox.length; i++) {
            categoryBox[i].addEventListener('mouseenter', categoryEnter);
            categoryBox[i].addEventListener('mouseleave', categoryLeave);
         }

         // Mouse enter
         function categoryEnter() {
            let title = this.querySelector('.title'),
               titleHeight = title.offsetHeight,
               self = this;
            this.classList.add('active4');
            setTimeout(function() {
               title.style.marginBottom = (-titleHeight) + 'px';
               setTimeout(function() {
                  self.classList.remove('active4');
                  self.classList.add('active')
                  setTimeout(function() {
                     self.classList.add('active2');
                  }, 50);
               }, 112.5);
            }, 112.5);
         }

         // Mouse out
         function categoryLeave() {
            let title = this.querySelector('.title'),
               self = this;
            this.classList.add('active3');
            title.classList.add('active');
            setTimeout(function() {
               self.classList.remove('active3');
               self.classList.remove('active2');
               self.classList.remove('active');
               setTimeout(function() {
                  title.style.marginBottom = '20px';
                  title.classList.remove('active');
                  title.style.display = 'block';
                  self.classList.remove('active3');
                  self.classList.remove('active2');
                  self.classList.remove('active');
               }, 100);
            }, 225);
         }

         // View More Btn
         categoryBoxContainer.addEventListener('click', function(e) {
            if (globalObj.closest(e.target, '.box-btn')) {
               let popup = globalObj.closest(e.target, '.box-container').querySelector('.popup-container');
               popup.classList.add('active');
            }
         });

         // Close Popup
         section.addEventListener('click', function(e) {
            if (globalObj.closest(e.target, '.close-popup-btn') || e.target.classList.contains('popup-container')) {
               let popupBox;
               if (!e.target.classList.contains('popup-container')) {
                  popupBox = globalObj.closest(e.target, '.popup-box');
               } else {
                  popupBox = e.target.querySelector('.popup-box');
               }
               popupBox.classList.add('active');
               setTimeout(function() {
                  popupBox.parentElement.classList.add('active2');
                  setTimeout(function() {
                     popupBox.parentElement.classList.remove('active');
                     popupBox.parentElement.classList.remove('active2');
                     popupBox.classList.remove('active');
                  }, 225);
               }, 225);
            }
         });
      }
      
      // On Load
      if (arr.includes('load')) {
         // Set Category
         categoryInit();
      }

      // On Resize
      if (arr.includes('resize')) {
         // Position category
         categoryInit();
         setTimeout(function() {
            categoryInit();
         }, 500);
      }

      // On Scroll
      if (arr.includes('scroll')) {
         // Check services section animtion and active popup
         if (section.offsetTop - window.scrollY < window.innerHeight) {
            let boxContainer = section.querySelector('.category-list .category-box');
            Array.from([...boxContainer.children]).filter(function(item) {
               if (item.classList.contains('aos-animate')) {
                  item.classList.add('done-anim');
               }
            });
         }
      }

      // Category Init
      function categoryInit() {
         if (!section.classList.contains('done')) {
            // Select First Category
            category.querySelector('.category').classList.add('active');
            category.querySelector('.category .icon').classList.add('active');
            categoryBoxContainer.children[0].classList.add('active');
            section.classList.add('done')
         } else {
            category = section.querySelector('.inner-category');
            globalObj.status.categoryPos = [];
         }

         for (let i = 0; i < category.children.length; i++) {
            globalObj.status.categoryPos.push(category.children[i].clientWidth);
         }
         // Set overlay position
         setStyle();
      }

      // Set Style
      function setStyle() {
         if (window.innerWidth > 570) {
            categoryOverlay = section.querySelector('.category-overlay');
            let styleTxt = '',
               containerPos = category.getBoundingClientRect().left,
               currPos = categoryChild[globalObj.status.categoryIndex].getBoundingClientRect().left - containerPos,
               customStyle = document.createElement('style'),
               catePos = globalObj.status.categoryPos;
            styleTxt = '.services-section .category-overlay {width:'+ catePos[globalObj.status.categoryIndex] +'px; left:'+ currPos +'px;}';
            if(document.head.querySelector('.cus-style')) {
               document.head.querySelector('.cus-style').remove()
            }
            customStyle.className = 'cus-style';
            customStyle.appendChild(document.createTextNode(styleTxt));
            setTimeout(function() {
               document.head.appendChild(customStyle);
               if (document.head.querySelectorAll('.cus-style').length > 1) {
                  document.head.querySelector('.cus-style').remove();
               }
            }, 1);
         }
      }
   }
}


// *** talk Section ***

function talkSectionFun(arr) {
   if (document.querySelector('section.talk-section')) {
      let section = document.querySelector('section.talk-section'),
         upBtn   = section.querySelector('.up-btn');
      if (arr.includes('init')) {
         // Scroll to Up on click
         upBtn.addEventListener('click', function() {
            globalObj.navbarNavigation(this, false);
         });
      }
   }
}


// *** Reviews Section ***

function reviewsSectionFun(arr) {
   if (document.querySelector('.reviews-section')) {
      let section = document.querySelector('.reviews-section'),
          reviews = section.querySelector('.reviews-container');

      if (arr.includes('init')) {
         globalObj.carousel();
      }

      if (arr.includes('resize')) {
         globalObj.carouselResize();
      }
   }
}
