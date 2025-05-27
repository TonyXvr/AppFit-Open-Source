# Product Coach Feature Plan

## Current Behavior

### `ProductCoach.tsx`
- Maintains state for the current insight and uses the Perplexity API to analyze the project:
  - Gathers file contents from the store and sends them to the Perplexity service.
  - Updates the store with new insights (e.g., recommended improvements, market data).
- Displays a small header with "Last Analyzed" time and a "Refresh" button if insights are available.
- Renders the `ProductCoachPanel` if an insight has been loaded (or shows a loading/error state otherwise).

### `ProductCoachPanel.tsx`
- Organizes data into several tabs:
  - Overview: Project type and value proposition.
  - Market: Market size, target audience, competitor list, and trends.
  - Recommendations: A bar chart with priority distribution (high/medium/low), plus a list of improvements.
  - Growth: Growth opportunities (strategic directions).
  - Chat: Allows the user to ask questions or seek advice via a chat interface.

Overall, the user sees a project summary, market analysis, prioritized recommendations, potential growth avenues, and can converse with the Product Coach.

## Potential Feature Plan

1. **Enhanced Chat Capabilities**  
   - Integrate conversation memory for references to previous user messages.  
   - Provide built-in quick replies or prompts for typical questions.  
   - Add task integration (e.g., linking recommended changes to Jira/Trello/Asana).

2. **Interactive Action Items and Task Creation**  
   - [x] **Convert recommendations into trackable tasks:** Added a `status` field (`todo`/`done`) to recommendations and UI buttons to toggle the status. Status is currently stored in local component state.
   - [ ] **Persist recommendation status:** Save the `todo`/`done` status (e.g., using `localStorage` or updating the backend/store).
   - [ ] **Include a "Create Task" button:** Add functionality to push tasks into a project management tool (e.g., Jira, Trello, Asana).

3. **Deeper Analytics and Visualizations**  
   - [x] **Visualize Market Trends:** Replaced the bulleted list in the Market tab with a grid of cards, each featuring an icon and the trend description.
   - [x] **Visualize Competitors:** Updated type definition to include optional URLs. Updated UI to show competitor names with icons and clickable 'Visit Site' links if URL is present. (Note: Requires backend API update to provide URLs).
   - [ ] **Visualize Growth Opportunities:** Enhance the presentation of growth opportunities (e.g., ranked list, cards with icons).
   - [ ] **Enhance Priority Chart:** Add interactivity or more detail to the recommendation priority chart.
   - [ ] Add more advanced charts for financial projections, competitor comparisons, or time-based analytics.
   - [ ] Track changes across multiple "analysis sessions."

4. **Collaboration Features**  
   - Allow multiple team members to collaborate on insights, comment on recommendations, and coordinate tasks in real-time.

5. **Customization and Settings**  
   - Let users customize weighting for different metrics (market fit vs. implementation feasibility).  
   - Provide UI customization options (theme, layout tweaks, toggling tabs, etc.).

6. **Notifications and Alerts**  
   - Show notifications when new insights or updates appear.  
   - Offer dedicated alerts for urgent or critical findings.

7. **Advanced Growth Features**  
   - Estimate potential revenue or user growth from implemented recommendations.  
   - Provide strategic roadmaps or timelines based on priority level.

8. **Comparison Graph**
    - Possibly have a feature list for whatever the user is making as their product. 
    - At each point this feature list will get updated and then there can be a comparison to competitors on what their features are and a graph shows a ranking of their product vs other competitors.