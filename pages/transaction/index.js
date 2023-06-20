import { reloadHeader } from "../../modules/header";
import { getData } from "../../modules/http";
import { reloadTable } from "../../modules/ui";
import { user } from "../../modules/user";

let body = document.querySelector('tbody');

reloadHeader()

getData('/transactions?user_id=' + user.id)
   .then(res => {
      if (res.status == 200 || res.status === 201) {
         if (body !== null) reloadTable(res.data, body);
      }
   })