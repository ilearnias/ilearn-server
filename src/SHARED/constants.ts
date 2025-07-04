export const PERMISSIONS = {
    // Organization permissions
    MANAGE_ORGANIZATION: 'manage_organization',
    VIEW_ORGANIZATION: 'view_organization',
    
    // User permissions
    MANAGE_USERS: 'manage_users',
    VIEW_USERS: 'view_users',
    CREATE_USER: 'create_user',
    EDIT_USER: 'edit_user',
    DELETE_USER: 'delete_user',
    
    // Lead permissions
    CREATE_LEAD: 'create_lead',
    EDIT_LEAD: 'edit_lead',
    DELETE_LEAD: 'delete_lead',
    VIEW_LEAD: 'view_lead',
    
    // Deal permissions
    CREATE_DEAL: 'create_deal',
    EDIT_DEAL: 'edit_deal',
    DELETE_DEAL: 'delete_deal',
    VIEW_DEAL: 'view_deal',
    
    // Product permissions
    MANAGE_PRODUCTS: 'manage_products',
    VIEW_PRODUCTS: 'view_products'
  } as const;
  