const companyProfileList = ({ objects, user, locale }) => {
  let result = "";
  for (let key in objects) {
    let item = objects[key];
    result += generateItem(item, locale);
  }
  return result;
};

const generateItem = (item, locale) => {
  return `
    <div class="company_item">
      <div class="company_item_info">
        <img src="/uploads${item.images.thumb}">
        <span class="type ${item.type}">${item.type}</span>
        <span class="status ${item.status}">${item.status}</span>
        <h2>${item.name[locale]}</h2>
      </div>
      <div class="company_control">
        <a href="/${locale}/profile/company/${item.type}/update/${item.id}">Update</a>
        <a class="delete_company" href="/${locale}/profile/company/${item.type}/delete/${item.id}">Delete</a>
      </div>
    </div>
  `;
};

module.exports = { companyProfileList };
