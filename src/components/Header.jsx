import { useContext, useState } from 'react';
import { Box, Flex, Heading, Spacer, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, Text, Badge, Button } from "@chakra-ui/react";
import { FaShoppingCart, FaUserCircle, FaTools, FaTrash } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex align="center">
        <Heading size="md">
          <Link as={RouterLink} to="/" color="white" _hover={{ textDecoration: 'none' }}>
            Registrar
          </Link>
        </Heading>
        <Spacer />
        <Link as={RouterLink} to="/tools" mx={2}>
          <IconButton
            icon={<FaTools />}
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Tools"
          />
        </Link>
        <Menu isOpen={isOpen} onClose={toggleMenu}>
          <MenuButton
            as={IconButton}
            icon={
              <Box position="relative">
                <FaShoppingCart />
                {cartItems.length > 0 && !isOpen && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-1"
                    right="-1"
                    fontSize="0.8em"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Box>
            }
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Cart"
            onClick={toggleMenu}
          />
          <MenuList minWidth="540px" color="black"> {/* Increased width by 50% */}
            {cartItems.length === 0 ? (
              <MenuItem>No items in cart</MenuItem>
            ) : (
              <>
                <MenuItem pointerEvents="none">
                  <Flex justify="space-between" width="100%">
                    <Text fontWeight="bold" flex="1" textAlign="left">Name</Text>
                    <Text fontWeight="bold" flex="1" textAlign="left">Price</Text>
                    <Text fontWeight="bold" flex="1" textAlign="left">Remove</Text>
                  </Flex>
                </MenuItem>
                {cartItems.map((item, index) => (
                  <MenuItem key={index}>
                    <Flex justify="space-between" width="100%" gap="10px">
                      <Text flex="1" textAlign="left">{item.name}</Text>
                      <Text flex="1" textAlign="left">${item.price} per year</Text>
                      <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeFromCart(index)}
                        aria-label="Remove item"
                      />
                    </Flex>
                  </MenuItem>
                ))}
                <MenuItem>
                  <Button colorScheme="blue" width="100%">Checkout</Button>
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
        <Link as={RouterLink} to="/profile" mx={2}>
          <IconButton
            icon={<FaUserCircle />}
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Profile"
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Header;