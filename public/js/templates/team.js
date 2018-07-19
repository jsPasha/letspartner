const teamList = obj => {
  let members = `<div class="list_item_wrap list_members">`;
  const team = obj.members;
  team.forEach(el => {
    let ava = el.image ? `/uploads${el.image}` : '/img/logo.svg'
    members += `
      <div class="item flx jcsb aic">
        <div class="flx aic">
          <img class="ava" src="${ava}">
          ${el.email}
          ${el.confirmed ? 'confirmed' : 'not confirmed'}
        </div>
        <span v-on:click="deleteMember('${obj.id}','${el.id}')"><img width="24" src="/img/delete.svg" /></span>
      </div>`;
  });
  members += `</div>`
  return members;
};

module.exports = { teamList };
