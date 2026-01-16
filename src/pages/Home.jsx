import { useNavigate } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-home-bg bg-center bg-opacity-50 bg-cover flex flex-col items-center h-full min-h-screen">
      <div className="mt-40">
        <p className="text-9xl font-prata text-center" >Desiary</p>
        <p className="text-5xl font-alexBrush text-center mt-2" >A place to store your Dreams and wishes </p>
      </div>
      <div className="flex flex-wrap gap-4 p-8 justify-center">
        <Card title="Wishlist" image='/wishlist.jpg' path="/home/user/wishlist"/>
        <Card title="Travel Bucket List" image='/travel.jpg' path="/home/user/travel"/>
        <Card title="Memories" image='/memories.jpg' path="/home/user/memories"/>
        <Card title="Journal" image='/journal.jpg' path="/home/user/journal"/>
      </div>
    </div>
  )
};

const Card = ({title, image,path}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FF8B9C] cursor-pointer aspect-square w-80 h-80 rounded-lg relative" onClick={()=>navigate(path)} >
      <img src={image} alt={title} className="object-cover w-full h-full  rounded-lg" />
      <div className="absolute h-full w-full bg-gradient-to-t from-white to-transparent top-0 to-35%"></div>
      <p className="text-2xl font-prata text-center absolute bottom-3 w-full">{title}</p>
    </div>
  )
}

export default Home;
