var app = new Vue({
  el: "#app",
  data: {
    list: [],
    addShow: -1,
    editGi: -1,
    editlI: -1,
    editLink: "",
    editDesc: "",
    editGroupNameIndex: -1,
    newGroupName: "",
  },
  methods: {
    showAdd: function (i) {
      if (i !== this.addShow) {
        //关闭修改
        this.closeEdit();

        this.addShow = i;
      } else {
        this.addShow = -1;
      }
    },
    addLink: function (i) {
      let addDesc = this.list[i].add_desc;
      let addLink = this.list[i].add_link;
      this.list[i].link_list.push({ link: addLink, desc: addDesc });
      this.list[i].add_desc = "";
      this.list[i].add_link = "";
      this.addShow = -1;
      this.saveStorage();
    },
    deleteLink: function (gI, lI) {
      let that = this;
      this.list[gI].link_list.splice(lI, 1);
      this.saveStorage();
    },
    saveStorage: function (data) {
      let that = this;
      if(data){
        this.list = data
      }

      setTimeout(function () {
        console.log(that.list)
        localStorage.setItem("_my_nav", JSON.stringify(that.list));
        for (let i = 0; i < that.list.length; i++) {
          chrome.storage.sync.set(
            { ['yourNav' + i]: JSON.stringify(that.list[i]) },
            function () {
              console.log("save sync");
            }
          );
        }


      }, 100);
    },
    closeAdd: function () {
      this.addShow = -1;
    },
    toeditLink: function (gI, lI, link, desc) {
      // 关闭新增
      this.closeAdd();

      this.editGi = gI;
      this.editlI = lI;
      this.editLink = link;
      this.editDesc = desc;
    },
    closeEdit: function () {
      this.editGi = -1;
      this.editlI = -1;
    },
    saveEditLink: function () {
      this.list[this.editGi].link_list[this.editlI].link = this.editLink;
      this.list[this.editGi].link_list[this.editlI].desc = this.editDesc;
      this.saveStorage();
      this.closeEdit();
    },
    showEditGroupName: function (groupIndex) {
      this.editGroupNameIndex = groupIndex;
    },
    closeShowEditGroupName: function () {
      this.editGroupNameIndex = -1;
    },
    saveNewGroupName: function () {
      this.list[this.editGroupNameIndex].group_name = this.newGroupName;
      this.saveStorage();
      this.closeShowEditGroupName();
    },
    deleteGroup: function (gindex) {
      if (this.list[gindex].link_list.length === 0) {
        this.list.splice(gindex, 1);
        this.saveStorage();
      } else {
        var r = confirm("Deleting a group will remove all links in the group");
        if (r == true) {
          this.list.splice(gindex, 1);
          this.saveStorage();
        } else {
        }
      }
    },
    addGroup: function () {
      this.list.push({
        group_name: "new group" + (this.list.length + 1),
        add_desc: "",
        add_link: "",
        link_list: [],
      });
      this.saveStorage();
    },
  },
});
let data = JSON.parse(localStorage.getItem("_my_nav_"));
if (data) {
  app.list = data;
} else {
  app.list = [
    {
      group_name: "default group",
      add_desc: "",
      add_link: "",
      link_list: [
        {
          link: "https://github.com/channg",
          desc: "channg",
        },
      ],
    },
  ];
}

document.addEventListener("visibilitychange", function () {
  console.log(123)
  let data = JSON.parse(localStorage.getItem("_my_nav_"));
  if (data) {
    app.list = data;
  }
});

chrome.storage.sync.get(null, function (result) {
  console.log(result)
  let gs = []
  let index = 0
  while (result && result['yourNav' + index]) {
    gs.push(JSON.parse(result['yourNav' + index]))
    index = index + 1
  }
  if (gs.length > 0) {
    localStorage.setItem("_my_nav", JSON.stringify(gs));
    if (data) {
      app.list = gs;
    }

    localStorage.setItem("_my_nav_", JSON.stringify(gs));
    if (data) {
      app.list = gs;
    }
  }
});
