SELECT 
  id,
  first_name,
  last_name,
  email,
  phone,
  mobile,
  employee_number,
  role,
  function_title,
  is_active
FROM sales_team 
WHERE company_id = '00000000-0000-0000-0000-000000000001' 
ORDER BY last_name;
