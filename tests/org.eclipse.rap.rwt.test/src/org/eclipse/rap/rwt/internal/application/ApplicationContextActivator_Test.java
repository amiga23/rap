/*******************************************************************************
 * Copyright (c) 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.application;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import junit.framework.TestCase;

import org.eclipse.rap.rwt.internal.engine.RWTConfiguration;
import org.eclipse.rap.rwt.internal.lifecycle.LifeCycleFactory;
import org.eclipse.rap.rwt.internal.resources.JSLibraryConcatenator;
import org.eclipse.rap.rwt.internal.resources.ResourceRegistry;
import org.eclipse.rap.rwt.internal.service.ServiceManager;
import org.eclipse.rap.rwt.internal.service.StartupPage;
import org.eclipse.rap.rwt.internal.theme.ThemeManager;
import org.eclipse.rap.rwt.resources.IResource;
import org.eclipse.rap.rwt.resources.IResourceManager;


public class ApplicationContextActivator_Test extends TestCase {

  private ApplicationContext applicationContext;
  private LifeCycleFactory lifeCycleFactory;
  private ThemeManager themeManager;
  private JSLibraryConcatenator jsLibraryConcatenator;
  private ServiceManager serviceManager;

  @Override
  protected void setUp() {
    mockApplicationContext();
  }

  public void testActivate() {
    ApplicationContextActivator activator = new ApplicationContextActivator( applicationContext );

    activator.activate();

    verify( themeManager ).activate();
    verify( lifeCycleFactory ).activate();
    verify( jsLibraryConcatenator ).activate();
    verify( jsLibraryConcatenator ).startJSConcatenation();
  }

  public void testDeactivate() {
    ApplicationContextActivator activator = new ApplicationContextActivator( applicationContext );

    activator.deactivate();

    verify( jsLibraryConcatenator ).deactivate();
    verify( lifeCycleFactory ).deactivate();
    verify( serviceManager ).clear();
    verify( themeManager ).deactivate();
  }

  private void mockApplicationContext() {
    applicationContext = mock( ApplicationContext.class );

    themeManager = mock( ThemeManager.class );
    when( themeManager.getRegisteredThemeIds() ).thenReturn( new String[ 0 ] );
    when( applicationContext.getThemeManager() ).thenReturn( themeManager );

    lifeCycleFactory = mock( LifeCycleFactory.class );
    when( applicationContext.getLifeCycleFactory() ).thenReturn( lifeCycleFactory );

    RWTConfiguration rwtConfiguration = mock( RWTConfiguration.class );
    when( applicationContext.getConfiguration() ).thenReturn( rwtConfiguration );

    serviceManager = mock( ServiceManager.class );
    when( applicationContext.getServiceManager() ).thenReturn( serviceManager );

    jsLibraryConcatenator = mock( JSLibraryConcatenator.class );
    when( applicationContext.getJSLibraryConcatenator() ).thenReturn( jsLibraryConcatenator );

    IResourceManager resourceManager = mock( IResourceManager.class );
    when( applicationContext.getResourceManager() ).thenReturn( resourceManager );

    StartupPage startupPage = mock( StartupPage.class );
    when( applicationContext.getStartupPage() ).thenReturn( startupPage );

    ResourceRegistry resourceRegistry = mock( ResourceRegistry.class );
    when( resourceRegistry.get() ).thenReturn( new IResource[ 0 ] );
    when( applicationContext.getResourceRegistry() ).thenReturn( resourceRegistry );
  }

}
