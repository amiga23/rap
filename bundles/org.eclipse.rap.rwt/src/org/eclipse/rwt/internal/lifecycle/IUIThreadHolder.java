/*******************************************************************************
 * Copyright (c) 2008 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 ******************************************************************************/
package org.eclipse.rwt.internal.lifecycle;

import org.eclipse.rwt.internal.service.ServiceContext;

public interface IUIThreadHolder {

  void setServiceContext( final ServiceContext serviceContext );

  void updateServiceContext();

  void switchThread();

  void terminateThread();
  
  Thread getThread();
  
  Object getLock();
}