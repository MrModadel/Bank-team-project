import axios from "axios";
import { getData, patchData } from "../../../modules/http"
import { getRandomColors, reloadTable } from "../../../modules/ui"
import { user } from "../../../modules/user";
let doc = document
const card_id = location.search.split('=').at(-1);
let tbody = doc.querySelector('tbody');
let name = doc.getElementById('name');
let userName = doc.getElementById('user-name');
let indexs_p = doc.querySelectorAll('#id-Index p');
let currencys = doc.querySelectorAll('.currency');
let balance = doc.getElementById('balance');
let btn = doc.getElementById('btn__exchange');
let toName = doc.getElementById('to');
let to = "UZS"
userName.innerText = user.lastname + ' ' + user.firstname
getData('/cards/' + card_id)
   .then(card => {
      let item = card.data;

      let [one, two, tre, fou] = item.id.split('-');
      let map = {
         1: one.slice(0, 4),
         2: two,
         3: tre,
         4: fou
      }
      if (item.currency === 'UZS') {
         toName.innerText = 'USD'
         to = "USD"
      }

      name.innerText = item.name;
      currencys.forEach(i => {
         i.innerText = item.currency
      })
      balance.innerText = item.balance
      let n = 1
      indexs_p.forEach(p => {
         p.innerText = map[n]
         n++;
      })
      btn.onclick = () => {
         axios.get(`https://api.apilayer.com/fixer/convert?to=${to}&from=${item.currency}&amount=${item.balance}`, {
            headers: {
               apiKey: import.meta.env.VITE_API_KEY
            }
         }).then(res => {
            if (res.status === 200 || res.status === 201) {
               patchData('/cards/' + item.id, { balance: res.data.result, currency: to })
                  .then(response => {
                     alert('Всё прошло успесно)!');
                     setInterval(()=>{
                        location.reload()
                     },300)
                  })
            }
         })
            .catch(error => alert('Что-то пошло не так'));
      }
   })
getData('/transactions/?card.id=' + card_id)
   .then(res => {
      reloadTable(res.data, tbody)
   })
function mauseTransform() {
   // Init
   var container = doc.getElementById("container"),
      inner = doc.getElementById("inner");

   // Mouse
   var mouse = {
      _x: 0,
      _y: 0,
      x: 0,
      y: 0,
      updatePosition: function (event) {
         var e = event || window.event;
         this.x = e.clientX - this._x;
         this.y = (e.clientY - this._y) * -1;
      },
      setOrigin: function (e) {
         this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
         this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
      },
      show: function () {
         "(" + this.x + ", " + this.y + ")";
      }
   };

   // Track the mouse position relative to the center of the container.
   mouse.setOrigin(container);

   //----------------------------------------------------

   var counter = 0;
   var refreshRate = 10;
   var isTimeToUpdate = function () {
      return counter++ % refreshRate === 0;
   };

   //----------------------------------------------------

   var onMouseEnterHandler = function (event) {
      update(event);
   };

   var onMouseLeaveHandler = function () {
      inner.style = "";
   };

   var onMouseMoveHandler = function (event) {
      if (isTimeToUpdate()) {
         update(event);
      }
   };

   //----------------------------------------------------

   var update = function (event) {
      mouse.updatePosition(event);
      updateTransformStyle(
         (mouse.y / inner.offsetHeight / 2).toFixed(2),
         (mouse.x / inner.offsetWidth / 2).toFixed(2)
      );
   };

   var updateTransformStyle = function (x, y) {
      var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
      inner.style.transform = style;
      inner.style.webkitTransform = style;
      inner.style.mozTranform = style;
      inner.style.msTransform = style;
      inner.style.oTransform = style;
   };

   //--------------------------------------------------------

   container.onmousemove = onMouseMoveHandler;
   container.onmouseleave = onMouseLeaveHandler;
   container.onmouseenter = onMouseEnterHandler;
};
mauseTransform()
let card = doc.querySelector('.card');
let cardInner = doc.querySelector('.card-inner');
card.onclick = () => {
   cardInner.classList.toggle('trans')
}
