const Participants = () => {
    return <div className="absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center shadow-md">
        List of Users
    </div>
}

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
        );
};

export default Participants;