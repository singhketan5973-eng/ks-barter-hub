---
title: Category endpoints
type: reference
last_verified: unverified
---

# Category endpoints

Categories group listings. Each category is either for things (`item`) or for skills (`service`). For the rules that apply to all endpoints, see the [API overview](overview.md).

## GET /categories

Returns every active category as a tree.

**Authentication:** None.

The response has the header `Cache-Control: public, max-age=300`, so clients can reuse it for 5 minutes.

Response `200`:

```json
{
  "categories": [
    {
      "id": "6ac9f0a1d582c6a3bf99e700",
      "name": "Books and study",
      "slug": "books-and-study",
      "kind": "item",
      "parent": null,
      "sortOrder": 10,
      "isActive": true,
      "createdAt": "2026-11-06T10:00:00.000Z",
      "updatedAt": "2026-11-06T10:00:00.000Z",
      "children": []
    }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | The category's id |
| `name` | string | Display name |
| `slug` | string | A URL-friendly name, unique across categories |
| `kind` | string | `item` for things, `service` for skills |
| `parent` | string or null | The id of the parent category. `null` for a top-level category. |
| `sortOrder` | number | Position within the list. Lower numbers come first. |
| `isActive` | boolean | Always `true` in this response |
| `children` | array | Sub-categories, in the same shape |

Categories appear in this order: items first, then services, each sorted by `sortOrder`, then by name. A category whose parent is inactive does not appear.

## Starter categories

The command `npm run seed:categories` in the `server` folder adds these 16 categories. It skips any category that already exists, so it is safe to run again.

| Kind | Categories |
| --- | --- |
| `item` | Books and study, Electronics, Home and furniture, Clothing and accessories, Sports and outdoors, Music and hobbies, Kids and baby, Other things |
| `service` | Tutoring and lessons, Repairs and fixing, Cooking and food, Design and creative, Tech and web, Home help, Care and wellness, Other services |
