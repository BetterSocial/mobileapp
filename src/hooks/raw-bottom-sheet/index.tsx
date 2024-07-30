import * as React from 'react';

export type useRawBottomSheetProps = {
  closeCallback?: () => void;
};

const useRawBottomSheetHook = (closeCallback?: () => void) => {
  const rbSheetRef = React.useRef(null);
  const closeRbSheetRef = React.useRef(false);
  const open = () => {
    if (!rbSheetRef?.current) return;

    closeRbSheetRef.current = true;
    rbSheetRef?.current?.open();
  };

  const onClose = () => {
    if (!rbSheetRef?.current) return;

    if (closeRbSheetRef?.current) closeCallback?.();
    closeRbSheetRef.current = false;
  };

  const forceCloseRbSheet = () => {
    if (!rbSheetRef?.current) return;

    closeRbSheetRef.current = false;
    rbSheetRef?.current?.close();
  };

  return {
    rbSheetRef,
    open,
    onClose,
    forceCloseRbSheet
  };
};

export default useRawBottomSheetHook;
