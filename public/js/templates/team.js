const teamList = obj => {
  let members = "";
  const team = obj.members;
  team.forEach(el => {
    members += `<p>${el.email} ${el.confirmed ? 'confirmed' : 'not confirmed'} <span v-on:click.prevent="deleteMember('${obj.id}','${el.id}')">delete</span></p>`;
  });
  return members;
};

module.exports = { teamList };
