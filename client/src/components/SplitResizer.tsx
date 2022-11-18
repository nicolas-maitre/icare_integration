import * as React from "react";
import { RefObject, useRef } from "react";
import styled from "styled-components";

interface EdgeResizer {
  elementRef: RefObject<HTMLElement>;
  direction?: "horizontal";
}
export function EdgeResizer({
  elementRef,
  direction = "horizontal",
}: EdgeResizer) {
  const state = useRef({
    isDragging: false,
    startPos: 0,
    startWidth: 0,
    baseWidth: "",
    onMouseMove(evt: MouseEvent) {
      if (state.current.isDragging && elementRef.current)
        elementRef.current.style.width =
          state.current.startWidth +
          evt.clientX -
          state.current.startPos +
          "px";
    },
    onMouseUp(evt: MouseEvent) {
      state.current.isDragging = false;
      document.body.removeEventListener("mousemove", state.current.onMouseMove);
      document.body.removeEventListener("mouseup", state.current.onMouseUp);
    },
  });
  return (
    <ScEdgeResizer
      onMouseDown={(evt) => {
        if (elementRef.current?.clientWidth !== undefined) {
          const elemWidth = elementRef.current.getBoundingClientRect().width;
          Object.assign(state.current, {
            isDragging: true,
            startPos: evt.clientX,
            startWidth: elemWidth,
            baseWidth: state.current.baseWidth,
          });
          document.body.addEventListener(
            "mousemove",
            state.current.onMouseMove
          );
          document.body.addEventListener("mouseup", state.current.onMouseUp);
        }
      }}
      onDoubleClick={(evt) => {
        if (elementRef.current)
          elementRef.current.style.width = state.current.baseWidth;
        state.current.isDragging = false;
        state.current.baseWidth = "";
      }}
    />
  );
}

export const ScEdgeResizer = styled.div`
  cursor: col-resize;
  width: 10px;
  border-radius: 100px;
  background-color: transparent;

  position: relative;
  ::before {
    content: "";
    display: inline-block;
    position: absolute;
    border-radius: 100px;
    top: 30%;
    height: 40%;
    width: 30%;
    left: 35%;
    background-color: transparent;
    transition: background-color 250ms;
  }

  /* Animations schenanigans */
  transition: background-color 250ms;
  :hover {
    background-color: #00000050;
    ::before {
      background-color: #ffffffb0;
    }
  }
  :active {
    background-color: #00000051;
    ::before {
      background-color: #ffffffb1;
    }
  }
  :hover:not(&:active) {
    transition-delay: 500ms;
    ::before {
      transition-delay: 500ms;
    }
  }
`;
