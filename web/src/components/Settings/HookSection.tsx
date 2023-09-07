import { Button, Dropdown, Input, Menu, MenuButton } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as api from "@/helpers/api";
import { useUserStore } from "@/store/module";
import { useTranslate } from "@/utils/i18n";
import showChangeMemberPasswordDialog from "../ChangeMemberPasswordDialog";
import { showCommonDialog } from "../Dialog/CommonDialog";
import Icon from "../Icon";
import { useMemoHookStore } from "@/store/module/memohook";

interface State {
  createHookName: string;
  createHookUrl: string;
}

const PreferencesSection = () => {
  const t = useTranslate();
  const userStore = useUserStore();
  const hookStore = useMemoHookStore();
  const currentUser = userStore.state.user;
  const [state, setState] = useState<State>({
    createHookName: "",
    createHookUrl: "",
  });
  const [hookList, setHookList] = useState<MemoHook[]>([]);

  useEffect(() => {
    fetchHookList();
  }, []);

  const fetchHookList = async () => {
    const { data } = await api.getMemoHookList();
    setHookList(data.sort((a, b) => a.ID - b.ID));
  };

  const handleHookNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      createHookName: event.target.value,
    });
  };

  const handleHookUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      createHookUrl: event.target.value,
    });
  };

  const handleCreateHookBtnClick = async () => {
    if (state.createHookName === "" || state.createHookUrl === "") {
      toast.error(t("message.fill-form"));
      return;
    }

    const hookCreate: MemoHookCreate = {
      name: state.createHookName,
      url: state.createHookUrl,
    };

    try {
      await api.createMemoHook(hookCreate);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    await fetchHookList();
    setState({
      createHookName: "",
      createHookUrl: "",
    });
  };

  
  const handleDeleteHookClick = (hook: MemoHook) => {
    showCommonDialog({
      title: "delete this hook?",
      content: hook.Name,
      style: "warning",
      dialogName: "delete-user-dialog",
      onConfirm: async () => {
        await hookStore.deleteHook(hook.ID);
        fetchHookList();
      },
    });
  };

  return (
    <div className="section-container member-section-container">
      <p className="title-text">{"Hooks"}</p>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-sm">{t("common.hookname")}</span>
          <Input type="text" placeholder={t("common.hookname")} value={state.createHookName} onChange={handleHookNameInputChange} />
        </div>
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-sm">{t("common.hookurl")}</span>
          <Input type="text" placeholder={t("common.hookurl")} value={state.createHookUrl} onChange={handleHookUrlInputChange} />
        </div>
        <div className="btns-container">
          <Button onClick={handleCreateHookBtnClick}>{t("common.create")}</Button>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-center mt-6">
        <div className="title-text">{t("setting.member-list")}</div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  ID
                </th>
                <th scope="col" className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                  Url
                </th>
                <th scope="col" className="relative py-2 pl-3 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hookList.map((hook) => (
                <tr key={hook.ID}>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900">{hook.ID}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                    {hook.Name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                    {hook.Url}
                  </td>
                  <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium flex justify-end">
                    {<Dropdown>
                        <MenuButton size="sm">
                          <Icon.MoreVertical className="w-4 h-auto" />
                        </MenuButton>
                        <Menu>
                            <button
                                className="w-full text-left text-sm leading-6 py-1 px-3 cursor-pointer rounded text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-600"
                                onClick={() => handleDeleteHookClick(hook)}
                            >
                                {t("setting.member-section.delete-member")}
                            </button>
                        </Menu>
                      </Dropdown>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;
