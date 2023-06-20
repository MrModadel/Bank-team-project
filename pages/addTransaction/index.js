import { v4 as uuidv4 } from 'uuid'
import { user } from '../../modules/user';
import { getData, patchData, postData } from '../../modules/http';

let form = document.forms.add
let ul = document.querySelector('.dropdown__list')

function getDate() {
   let d = new Date()
   return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes()
}



form.onsubmit = async (e) => {
   e.preventDefault();

   let transaction = {
      id: uuidv4(),
      user_id: user?.id,
      date: getDate()
   }

   let fm = new FormData(form)

   fm.forEach((value, key) => {
      transaction[key] = value
   })
   await getData('/cards/' + transaction?.card)
      .then(res => {
         transaction.card = res.data
         delete transaction.card.currency
         delete transaction.card.user_id
      })

   if (+transaction.amount <= +transaction.card.balance) {


      let { balance } = transaction.card
      patchData("/cards/" + transaction.card.id, { balance: +balance - transaction.amount })
         .then(res => {
            if (res.status === 200 || res.status === 201) {
               transaction.card.balance = +balance - transaction.amount;
               postData('/transactions', transaction)
                  .then(res => {
                     if (res.status === 200 || res.status === 201) {
                        location.assign('/pages/transaction/')
                     }
                  })
            }
         })
   } else {
      alert('Not enough money')
   }
}




// Полифилл для метода forEach для NodeList
if (window.NodeList && !NodeList.prototype.forEach) {
   NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
         callback.call(thisArg, this[i], i, this);
      }
   };
}
document.querySelectorAll('.dropdown').forEach(async function (dropDownWrapper) {
   const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
   const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
   const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

   await getData('/cards?user_id=' + user.id)
      .then(res => {
         if (res.status === 200 || res.status === 201) {
            for (let item of res.data) {
               let li = document.createElement('li');
               li.classList.add('dropdown__list-item');
               li.dataset.value = item.id;
               li.innerText = item.name;
               ul.append(li);
            }
            //настраиваем первый выдранный элемент
            dropDownBtn.innerText = res.data[0].name
            dropDownInput.value = res.data[0].id
         }
      })
   const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
   // Клик по кнопке. Открыть/Закрыть select
   dropDownBtn.addEventListener('click', function (e) {
      e.preventDefault()
      dropDownList.classList.toggle('dropdown__list--visible');
      this.classList.add('dropdown__button--active');
   });

   // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
   dropDownListItems.forEach(function (listItem) {
      listItem.addEventListener('click', function (e) {
         e.stopPropagation();
         dropDownBtn.innerText = this.innerText;
         dropDownBtn.focus();
         dropDownInput.value = this.dataset.value;
         dropDownList.classList.remove('dropdown__list--visible');
      });
   });

   // Клик снаружи дропдауна. Закрыть дропдаун
   document.addEventListener('click', function (e) {
      if (e.target !== dropDownBtn) {
         dropDownBtn.classList.remove('dropdown__button--active');
         dropDownList.classList.remove('dropdown__list--visible');
      }
   });

   // Нажатие на Tab или Escape. Закрыть дропдаун
   document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' || e.key === 'Escape') {
         dropDownBtn.classList.remove('dropdown__button--active');
         dropDownList.classList.remove('dropdown__list--visible');
      }
   });
});
