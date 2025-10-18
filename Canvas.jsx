import React, { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const CanvaLikeInterface = () => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Add a new text element
  const addTextElement = () => {
    setElements([
      ...elements,
      {
        id: Date.now(),
        type: "text",
        x: 50,
        y: 50,
        width: 100,
        height: 50,
        text: "Edit Me",
      },
    ]);
  };

  // Add an image element from uploaded file
  const addImageElement = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setElements([
        ...elements,
        {
          id: Date.now(),
          type: "image",
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          src: reader.result,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // Update element's position, size, or content
  const updateElement = (id, newProps) => {
    setElements(elements.map(el => (el.id === id ? { ...el, ...newProps } : el)));
  };

  // Delete the selected element
  const deleteSelectedElement = () => {
    if (selectedElementId) {
      setElements(elements.filter(el => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  return (
    <div className="flex h-screen font-sans w-screen overflow-hidden">
      {/* Toolbar */}
      <div className="w-1/5 bg-gray-100 p-4 border-r border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Toolbar</h3>
        <button
          className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={addTextElement}
        >
          Add Text
        </button>
        <label className="w-full mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer inline-block text-center">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => addImageElement(e.target.files[0])}
            className="hidden"
          />
        </label>
        
        {/* Layer Selection and Delete Option */}
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Layers</h4>
          <ul className="space-y-1">
            {elements.map(el => (
              <li
                key={el.id}
                onClick={() => setSelectedElementId(el.id)}
                className={`p-2 cursor-pointer rounded ${
                  selectedElementId === el.id ? "bg-blue-300" : "bg-gray-200"
                }`}
              >
                {el.type === "text" ? el.text : "Image Layer"}
              </li>
            ))}
          </ul>
          <button
            className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={deleteSelectedElement}
          >
            Delete Selected Layer
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 bg-gray-50">
        {elements.map((el) => (
          <DraggableElement
            key={el.id}
            element={el}
            updateElement={updateElement}
            isSelected={el.id === selectedElementId}
          />
        ))}
      </div>
    </div>
  );
};

const DraggableElement = ({ element, updateElement, isSelected }) => {
  const handleDrag = (e, data) => {
    updateElement(element.id, { x: data.x, y: data.y });
  };

  const handleResize = (e, { size }) => {
    e.stopPropagation(); // Prevent drag events from interfering with resizing
    updateElement(element.id, { width: size.width, height: size.height });
  };

  return (
    <Draggable
      position={{ x: element.x, y: element.y }}
      onDrag={handleDrag}
      handle=".draggable-handle" // Only allows dragging from the non-resizable areas
    >
      <div className="relative">
        <ResizableBox
          width={element.width}
          height={element.height}
          onResizeStop={handleResize}
          minConstraints={[50, 30]}
          resizeHandles={["se"]}
          className={`border ${isSelected ? "border-blue-500" : "border-dashed border-gray-400"} bg-white p-2`}
        >
          <div
            className={`draggable-handle ${
              element.type === "text" ? "text-center" : ""
            } w-full h-full flex items-center justify-center`}
          >
            {element.type === "text" ? (
              <input
                type="text"
                value={element.text}
                onChange={(e) => updateElement(element.id, { text: e.target.value })}
                className="text-center w-full bg-transparent focus:outline-none"
              />
            ) : (
              <img
                src={element.src}
                alt="uploaded"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default CanvaLikeInterface;
