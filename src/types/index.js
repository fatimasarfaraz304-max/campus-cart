/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email         - must be @cust.edu.pk
 * @property {string} full_name
 * @property {string} student_id
 * @property {string} department
 * @property {string} semester
 * @property {string} avatar_url
 * @property {number} rating
 * @property {number} total_sales
 * @property {boolean} is_verified
 * @property {string} created_at
 */

/**
 * @typedef {'books'|'digital'|'electronics'|'clothing'|'accessories'|'other'} Category
 */

/**
 * @typedef {'available'|'sold'|'reserved'} ListingStatus
 */

/**
 * @typedef {Object} Listing
 * @property {string} id
 * @property {string} seller_id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {Category} category
 * @property {ListingStatus} status
 * @property {string[]} images
 * @property {string} condition     - 'new'|'good'|'fair'|'poor'
 * @property {string} meetup_spot
 * @property {string[]} tags
 * @property {User} seller          - joined
 * @property {string} created_at
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} conversation_id
 * @property {string} sender_id
 * @property {string} content
 * @property {boolean} is_read
 * @property {string} created_at
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id
 * @property {string} listing_id
 * @property {string} buyer_id
 * @property {string} seller_id
 * @property {Message} last_message - joined
 * @property {Listing} listing      - joined
 * @property {User} other_user      - joined
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Notice
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {'exam'|'fee'|'event'|'general'|'urgent'} type
 * @property {boolean} is_read
 * @property {string} created_at
 */
