/*******************************************************************************
 * Copyright (c) 2011 Frank Appel and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Frank Appel - initial API and implementation
 ******************************************************************************/
package org.eclipse.rwt.application;

import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;

import org.eclipse.rwt.branding.AbstractBranding;
import org.eclipse.rwt.internal.engine.ApplicationConfigurable;
import org.eclipse.rwt.internal.engine.ApplicationContext;
import org.eclipse.rwt.internal.engine.ApplicationContextUtil;
import org.eclipse.rwt.internal.engine.Configurable;
import org.eclipse.rwt.internal.engine.RWTDelegate;
import org.eclipse.rwt.internal.resources.ResourceManagerImpl;

public class Application {
  
  public final static String RESOURCES = ResourceManagerImpl.RESOURCES;
  
  private final ServletContext servletContext;
  private final ApplicationConfigurator configurator;
  private final ApplicationContext applicationContext;
  
  public Application( ServletContext servletContext, ApplicationConfigurator configurator ) {
    this.applicationContext = new ApplicationContext();
    this.servletContext = servletContext;
    this.configurator = configurator;
  }
  
  public void start() {
    Configurable configurable = new ApplicationConfigurable( configurator, servletContext );
    applicationContext.addConfigurable( configurable );
    ApplicationContextUtil.set( servletContext, applicationContext );
    activateApplicationContext();
  }
  
  public void stop() {
    try {
      if( applicationContext.isActivated() ) {
        applicationContext.deactivate();
      }
    } finally {
      ApplicationContextUtil.remove( servletContext );
    }
  }
  
  public HttpServlet createServlet() {
    return new RWTDelegate();
  }
  
  public String[] getServletNames() {
    AbstractBranding[] all = applicationContext.getBrandingManager().getAll();
    Set<String> names = new HashSet<String>();
    for( AbstractBranding branding : all ) {
      names.add( branding.getServletName() );
    }
    return names.toArray( new String[ names.size() ] );
  }

  private void activateApplicationContext() {
    try {
      applicationContext.activate();
    } catch( RuntimeException rte ) {
      ApplicationContextUtil.remove( servletContext );
      throw rte;
    }
  }
}