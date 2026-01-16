import {useRef,useState,useEffect} from 'react'

function Journalopen() {
    const canvasRef = useRef(null);
    const [texts, setTexts] = useState([]);
    const [images, setImages] = useState([]);
    const [dragging, setDragging] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
  
    useEffect(() => {
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
  
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw texts
      texts.forEach(({ text, x, y }) => {
        context.font = "30px Arial";
        context.fillText(text, x, y);
      });
  
      // Draw images
      images.forEach(({ src, x, y }) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
          context.drawImage(image, x, y, 200, 200);
        };
      });
    }, [texts, images]);
  
    const addText = (value) => {
      // const newText = prompt("Enter your text:");
      if (value) {
        setTexts([...texts, { text: newText, x: 50, y: 50 }]);
      }
    };
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages([...images, { src: event.target.result, x: 100, y: 100 }]);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleMouseDown = (e) => {
      const { offsetX, offsetY } = e.nativeEvent;
      texts.forEach((text, index) => {
        if (offsetX >= text.x && offsetX <= text.x + 100 && offsetY >= text.y - 30 && offsetY <= text.y) {
          setDragging({ type: 'text', index });
        }
      });
      images.forEach((image, index) => {
        if (offsetX >= image.x && offsetX <= image.x + 200 && offsetY >= image.y && offsetY <= image.y + 200) {
          setDragging({ type: 'image', index });
        }
      });
    };
  
    const handleMouseMove = (e) => {
      if (dragging) {
        const { offsetX, offsetY } = e.nativeEvent;
        if (dragging.type === 'text') {
          const updatedTexts = [...texts];
          updatedTexts[dragging.index] = { ...updatedTexts[dragging.index], x: offsetX, y: offsetY };
          setTexts(updatedTexts);
        } else if (dragging.type === 'image') {
          const updatedImages = [...images];
          updatedImages[dragging.index] = { ...updatedImages[dragging.index], x: offsetX - 100, y: offsetY - 100 };
          setImages(updatedImages);
        }
      }
    };
  
    const handleMouseUp = () => {
      setDragging(null);
    };
  
    const handleDoubleClick = (e) => {
      const { offsetX, offsetY } = e.nativeEvent;
      texts.forEach((text, index) => {
        if (offsetX >= text.x && offsetX <= text.x + 100 && offsetY >= text.y - 30 && offsetY <= text.y) {
          const newText = prompt("Edit your text:", text.text);
          if (newText !== null) {
            const updatedTexts = [...texts];
            updatedTexts[index] = { ...updatedTexts[index], text: newText };
            setTexts(updatedTexts);
          }
        }
      });
    };
  
    return (
      <div className="w-screen h-screen bg-[#FDE1EF] overflow-hidden">
        <canvas
          ref={canvasRef}
          // color='bg-[#ff40a0]'
          width={window.screen.width-200}
          height={window.screen.height-400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          className='bg-[#ff40a0]'
        />
        <div>
          <input type="text" className='' onKeyDown={(key)=>{
            if (key.key==='Enter') {
              addText()
            }
          }} />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>
    );
}

export default Journalopen
