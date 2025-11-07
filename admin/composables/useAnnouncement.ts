import type { VDataTable } from "vuetify/components";
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";
type ReadonlyHeaders = VDataTable["$props"]["headers"];

export async function useAnnouncement() {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const { toggleOverlay } = useOverlayStore();
  const { showAlert } = useAlertStore();
  const api = useApi();

  const itemsPerPage = ref(10);
  const items: any = ref([]);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const search = ref("");
  const page = ref(1);
  const valid = ref(true);
  const lazy = ref(true);
  const rules = ref({
    required: (value: string) => !!value || "الزامی می باشد.",
    min: (v: any) => (v && v.length >= 8) || "حداقل 8 کاراکتر",
    email: (v: any) =>
      (v && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
      "لطفا ایمیل را به درستی وارد کنید",
  });
  const deleteDialog = ref(false);
  const itemToDelete = ref<string | null>(null);
  function createNewRecord() {
    return {
      id: "",
      title: "",
      body: "",
      status: true,
    };
  }
  const formModel = ref(createNewRecord());
  const dialog = shallowRef(false);
  const isEditing = toRef(() => !!formModel.value.id);
  const importanceOptions = ref([
    { title: "اطلاعیه", value: "Info" },
    { title: "هشدار", value: "Warning" },
    { title: "خطا", value: "Error" },
    { title: "موفق", value: "Success" },
  ]);
  const headers = ref<ReadonlyHeaders>([
    { title: "ردیف", key: "row", sortable: false, align: "center" },
    { title: "عنوان", key: "title", sortable: false, align: "start" },
    { title: "متن", key: "body", sortable: false, align: "start" },
    { title: "اهمیت", key: "importance", sortable: false, align: "start" },
    { title: "وضعیت", key: "status", sortable: false, align: "start" },
    { title: "تاریخ ایجاد", key: "createdAt", sortable: false, align: "start" },
    {
      title: "آخرین بروزرسانی",
      key: "updatedAt",
      sortable: false,
      align: "start",
    },
    { title: "عملیات", key: "actions", sortable: false, align: "center" },
  ]);
  const selectedImportance = ref(importanceOptions.value[0].value);

  onBeforeMount(async () => {
    await getData();
  });

  const getData = async () => {
    toggleOverlay(true);
    isLoading.value = true;
    let url = "";
    if (search.value) url = `&search=${search.value}`;
    try {
      const data: any = await api.get(
        `/api/v1/announcements/admin?page=${page.value}&limit=${itemsPerPage.value}${url}`
      );
      console.log(data);
      items.value = data.data;
      totalItems.value = data?.total;
    } finally {
      isLoading.value = false;
      toggleOverlay(false);
    }
  };

  function add() {
    formModel.value = createNewRecord();
    dialog.value = true;
  }

  function edit(id: string) {
    const found = items.value.find((item: any) => item._id === id);
    formModel.value = {
      id: found._id,
      title: found.title,
      body: found.body,
      status: found.status,
    };

    dialog.value = true;
  }

  const save = async () => {
    try {
      toggleOverlay(true);
      let payload: any = {};
      if (isEditing.value) {
        payload = {
          id: formModel.value.id,
          title: formModel.value.title,
          body: formModel.value.body,
          importance: selectedImportance.value,
          status: formModel.value.status,
        };
        await api.patch(`/api/v1/announcements/admin`, payload);
      } else {
        payload = {
          title: formModel.value.title,
          body: formModel.value.body,
          importance: selectedImportance.value,
          status: formModel.value.status,
        };
        await api.post(`/api/v1/announcements/admin`, payload);
      }
      dialog.value = false;
      showAlert({ text: "اطلاعات با موفقیت ثبت شد.", color: "success" });
      getData();
    } catch (error) {
      showAlert({ text: "خطای ارتباط با سرور", color: "error" });
    } finally {
      toggleOverlay(false);
    }
  };

  const rowNumber = (_id: string) => {
    return (
      itemsPerPage.value * (page.value - 1) +
      items.value
        .map(function (x: any) {
          return x._id;
        })
        .indexOf(_id) +
      1
    );
  };

  function confirmDelete(id: string) {
    itemToDelete.value = id;
    deleteDialog.value = true;
  }

  async function deleteItem() {
    if (!itemToDelete.value) return;
    try {
      toggleOverlay(true);
      await api.delete(`/api/v1/announcement/admin/${itemToDelete.value}`);
      showAlert({ text: "با موفقیت حذف شد.", color: "success" });
      getData();
    } catch (error) {
      showAlert({ text: "خطای ارتباط با سرور", color: "error" });
    } finally {
      toggleOverlay(false);
      deleteDialog.value = false;
    }
  }

  return {
    itemsPerPage,
    items,
    totalItems,
    isLoading,
    search,
    page,
    valid,
    rules,
    deleteDialog,
    formModel,
    dialog,
    isEditing,
    importanceOptions,
    headers,
    selectedImportance,
    getData,
    add,
    edit,
    save,
    rowNumber,
    confirmDelete,
    deleteItem,
  };
}
