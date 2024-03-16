import NewButton from "./components/NewButton";
import List from "./components/List";

export const Sidebar = () => {
    return <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] p-3 flex flex-col gap-y-4 text-white">
        <List />
        <NewButton/>
    </aside>
};