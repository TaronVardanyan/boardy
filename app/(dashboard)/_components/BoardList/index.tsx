import EmptyFavorites from "../EmptyStates/empty-favorites";
import EmptySearch from "../EmptyStates/empty-search";
import EmptyBoards from "../EmptyStates/empty-boards";

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favorites?: string;
    }
}

const BoardList = ({ orgId, query }:BoardListProps) => {
    const data = [];
    
    if(!data.length && query.search) {
        return (<EmptySearch/>)
    }
    
    if(!data.length && query.favorites) {
        return (<EmptyFavorites/>)
    }
    
    if(!data.length) {
        return (<EmptyBoards/>)
    }
    
    return <div>fgfg</div>
}

export default BoardList;