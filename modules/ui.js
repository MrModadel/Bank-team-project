export function getRandomColors() {
   function getRGB() {
      function randomizer() {
         return Math.floor(Math.random() * 255)
      }
      let r = randomizer()
      let g = randomizer()
      let b = randomizer()
      return `${r},${g},${b}`
   }
   return `linear-gradient(84.36deg,rgba(${getRGB()}, 1),  rgba(${getRGB()}, 1))`
}

export function reload(arr, place) {
   let doc = document
   place.innerHTML = '';

   for (let card of arr) {
      let div = doc.createElement('div');
      let title = doc.createElement('div');
      let lang = doc.createElement('div');
      //class
      div.classList.add('item');
      title.classList.add('item__title');
      lang.classList.add('item__lang');
      //inner
      title.innerHTML = card.name;
      lang.innerHTML = card.currency;
      div.style.background = getRandomColors()
      div.style.cursor = "pointer"
      //append
      div.append(title, lang);
      place.append(div);

      div.onclick = () => {
         location.assign('/pages/cards/card/?id=' + card.id)
      }
   }
}
export function reloadTable(res, body) {
   let doc = document;
   body.innerHTML = ''
   let n = 1;
   for (let data of res) {
      let tr = doc.createElement('tr');
      for (let i = 0; i < 5; i++) {
         let td = doc.createElement('td');
         if (i === 0) {
            td.innerText = n;
         } else if (i === 1) {
            td.innerText = data.card.name;
         } else if (i === 2) {
            td.innerText = data.category;
         } else if (i === 3) {
            td.innerText = data.amount;
         } else if (i === 4) {
            let d = new Date();
            let getFullYear = d.getFullYear(),
               getMonth = (d.getMonth() + 1),
               getDate = d.getDate(),
               getHours = d.getHours(),
               getMinutes = d.getMinutes();
            let [YMD, HM] = data.date.split(' ');
            let [Hours, Minutes] = HM.split(':');
            let [Year, Month, Day] = YMD.split('-');
            if (getFullYear - +Year === 0) {
               if (getMonth - +Month === 0) {
                  if (getDate - +Day === 0) {
                     if (getHours - +Hours === 0) {
                        if (getMinutes - +Minutes === 0) {
                           td.innerText = `несколько секунд назад`;
                        } else {
                           if (getMinutes - +Minutes === 1) {
                              td.innerText = `минуту назад`;
                           } else {
                              td.innerText = `${getMinutes - +Minutes} минут назад`;
                           }
                        }
                     } else {
                        if (getHours - +Hours === 1) {
                           td.innerText = `час назад`;
                        } else {
                           td.innerText = `${getHours - +Hours} чесов назад`;
                        }
                     }
                  } else {
                     if (getDate - +Day === 1) {
                        td.innerText = `день назад`;
                     } else {
                        td.innerText = `${getDate - +Day} дней назад`;
                     }
                  }
               } else {
                  if (getMonth - +Month === 1) {
                     td.innerText = `месяц назад`;
                  } else {
                     td.innerText = `${getMonth - +Month} месяцев назад`;
                  }
               }
            } else {
               if (getFullYear - +Year === 1) {
                  td.innerText = `${getFullYear - +Year} год назад`;
               } else {
                  td.innerText = `${getFullYear - +Year} года назад`;
               }
            }
         }
         tr.append(td);
      }
      body.append(tr);
      n++;
   }
}
