import { EditorState, RichUtils, AtomicBlockUtils } from "draft-js";

export default function useDraftEditor(editorState, setEditorState) {
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInline = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const undo = () => {
    if (editorState.getUndoStack().size > 0) {
      setEditorState(EditorState.undo(editorState));
    }
  };

  const insertImage = (src) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src },
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newState, entityKey, " "),
    );
  };

  return {
    handleKeyCommand,
    toggleInline,
    undo,
    insertImage,
  };
}
