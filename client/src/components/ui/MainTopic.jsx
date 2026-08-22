const MainTopic = ({ topic, total }) => {
    return (
        <div className="font-itim text-secondary text-center space-y-2">
            <h1 className="font-bold text-5xl capitalize">{topic}</h1>
            <p className="text-lg">จำนวน <span className="bg-yellow-400">&nbsp;{total}&nbsp;</span> {topic}</p>
        </div>
    )
}
export default MainTopic