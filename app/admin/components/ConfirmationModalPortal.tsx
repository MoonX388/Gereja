'use client';

import { createPortal } from 'react-dom';
import type { ComponentProps } from 'react';
import ConfirmationModal from './ComfirmationModal';

type ConfirmationModalPortalProps = ComponentProps<typeof ConfirmationModal>;

export default function ConfirmationModalPortal(props: ConfirmationModalPortalProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(<ConfirmationModal {...props} />, document.body);
}