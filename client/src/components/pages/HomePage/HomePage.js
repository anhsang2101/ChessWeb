import './HomePage.css';
import PlayingOptions from '../../rightSideController/playingOptions/PlayingOptions';
import Sidebar from '../../sidebar/Sidebar';
import BoardDefault from '../../boards/BoardDefault';

function HomePage() {
  return (
    <div className="container">
      <Sidebar/>

      <BoardDefault controllerSide={<PlayingOptions/>}/>
      
    </div>
  );
}

export default HomePage;
